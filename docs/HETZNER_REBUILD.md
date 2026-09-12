# Rebuilding the backend server from scratch

You deleted the Hetzner VPS. This is the runbook to bring the backend
(`db` + `api` + `caddy`) back up on a fresh box. It's the short version of
[`HETZNER_DEPLOY.md`](./HETZNER_DEPLOY.md) — read that for the *why* behind any step;
this one is just the ordered checklist with the real values filled in.

Frontend is unaffected — it's on GitHub Pages and doesn't touch this server.

Everything below assumes `api.cowglow.io` (the API subdomain) and the
`cowglow/visual-directory` repo — steps 2, 3, 4, and 6 read those (plus `CLIENT_ORIGIN`
and `LEADER_EMAIL`) from `deploy/hetzner/config.env` instead of having you hand-edit
them here (see step 0). `gh`, `ssh`, `hcloud`, and `jq` must be installed and
`gh auth login` already done.

## What survived the teardown vs. what you rebuild

| Survived — leave alone | Rebuild / update |
|---|---|
| Hetzner Cloud **project** | The **server** (new box, new IP) |
| IONOS DNS **zone** for `cowglow.io` | The `api` **A record's value** (new IP) |
| GitHub repo + **11 of 12 secrets** (incl. `HETZNER_SSH_KEY`, set from `cert/id_hetzner`) | `HETZNER_HOST` secret (new IP) |
| SSH keypair in `cert/` (`id_hetzner` CI, `id_hetzner_admin` personal) | The `.pub` keys added to the new Hetzner server *before* it's created |
| The API image on `ghcr.io` | A fresh **SSH keypair** |
| `.github/workflows/deploy.yml`, `docker-compose.prod.yml`, `Caddyfile` | The first **leader account** (DB volume is gone → re-seed) |

The database volume went with the box, so **all member/org data is gone** and you
re-seed one leader account at the end.

---

## 0. Set these once in your terminal

```bash
set -a; source deploy/hetzner/config.env; set +a   # DOMAIN, SUBDOMAIN, GITHUB_REPO,
                                                      # CLIENT_ORIGIN, LEADER_EMAIL,
                                                      # HETZNER_* — see config.env.example
export SERVER_IP=                        # fill in after step 2
export SSH_KEY=cert/id_hetzner           # existing CI deploy key (repo-local, gitignored)
export ADMIN_KEY=cert/id_hetzner_admin   # your personal key, for manual SSH
```

`IONOS_API_KEY` (for step 3) and `GHCR_PAT` (if it needs rotating in step 5) aren't in
`config.env` — export those directly in your shell, same as the deploy key: they're
credentials, not config.

## 1. SSH keys — reuse the existing ones

The repo already carries them in `cert/` (gitignored, never committed):

- **`cert/id_hetzner`** (+ `.pub`) — the passphrase-free CI deploy key
  (`github-actions-deploy`). The `HETZNER_SSH_KEY` GitHub secret was set from this,
  so it should still match — you likely won't touch it in step 5.
- **`cert/id_hetzner_admin`** (+ `.pub`) — your personal (passphrase-protected) key
  for logging in by hand.

Only generate a fresh key if `cert/id_hetzner` is missing or you want to rotate:
`ssh-keygen -t ed25519 -C hetzner-deploy -f cert/id_hetzner -N ""`, then you *must*
`gh secret set HETZNER_SSH_KEY --repo "$GITHUB_REPO" < cert/id_hetzner` in step 4.

Confirm the CI key has no passphrase (CI can't unlock one — the most common cause of
a broken deploy):

```bash
ssh-keygen -y -P "" -f "$SSH_KEY" >/dev/null && echo "ok, no passphrase"
```

## 2. Provision the server

**Add the key to Hetzner *before* creating the server** — Hetzner only injects keys
that existed at create time; adding one to an existing box does nothing. An old
server's key copies may still exist in the project — a duplicate public key is
rejected on `hcloud ssh-key create`, so either delete the stale one first or reuse it
(`hcloud ssh-key list`).

Render `user-data.yml` (same template as a fresh setup — see
[`HETZNER_DEPLOY.md`](./HETZNER_DEPLOY.md#1-provision-the-server) for what it does):

```bash
sed -e "s#\${CI_PUBLIC_KEY}#$(cat cert/id_hetzner.pub)#" \
    -e "s#\${ADMIN_PUBLIC_KEY}#$(cat cert/id_hetzner_admin.pub)#" \
    deploy/hetzner/user-data.yml.tmpl > deploy/hetzner/user-data.yml
```

Then:

```bash
hcloud ssh-key create --name github-actions-deploy --public-key-from-file cert/id_hetzner.pub
hcloud ssh-key create --name admin --public-key-from-file cert/id_hetzner_admin.pub

# Re-attach the old firewall if it survived the teardown, otherwise recreate it:
hcloud firewall create --name visual-directory --rules-file - <<'EOF'
[
  {"direction": "in", "protocol": "tcp", "port": "22", "source_ips": ["0.0.0.0/0", "::/0"]},
  {"direction": "in", "protocol": "tcp", "port": "80", "source_ips": ["0.0.0.0/0", "::/0"]},
  {"direction": "in", "protocol": "tcp", "port": "443", "source_ips": ["0.0.0.0/0", "::/0"]}
]
EOF

hcloud server create --name visual-directory \
  --image "$HETZNER_IMAGE" --type "$HETZNER_SERVER_TYPE" --location "$HETZNER_LOCATION" \
  --ssh-key github-actions-deploy --ssh-key admin \
  --firewall visual-directory \
  --user-data-from-file deploy/hetzner/user-data.yml
```

Copy the server's public IP from the output (or `hcloud server ip visual-directory`)
→ `export SERVER_IP=<that ip>`. Cloud-init takes a minute or two after boot to install
Docker and create `deploy` — poll until it's done:

```bash
until ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new deploy@"$SERVER_IP" docker --version; do sleep 5; done
# -> prints the Docker version once cloud-init finishes (no password prompt)
```

If this keeps failing with "Permission denied (publickey)", the key on the box doesn't
match — recreate the server with the key selected, don't try to patch
`authorized_keys` after the fact. If it hangs instead,
`ssh -i "$SSH_KEY" root@"$SERVER_IP" 'cat /var/log/cloud-init-output.log'` shows what
cloud-init is stuck on.

## 3. Repoint DNS

The `$SUBDOMAIN` A record at IONOS still exists but points at the dead box —
`scripts/ionos-dns-upsert.sh` finds it by name and updates it in place (it only
touches this one record, never the root `$DOMAIN`/`www` records):

```bash
IONOS_API_KEY=... SERVER_IP="$SERVER_IP" scripts/ionos-dns-upsert.sh
```

Verify (may take minutes to an hour):

```bash
dig +short "$SUBDOMAIN.$DOMAIN" @1.1.1.1
# -> $SERVER_IP
```

Caddy can't issue its TLS cert until this resolves to the new box, so don't skip the
verify.

## 4. Sync the GitHub secrets

Reusing `cert/id_hetzner`, **only `HETZNER_HOST` changes** — the `HETZNER_SSH_KEY`
secret was already set from that key. **`HETZNER_HOST` must be the new IP** or the
deploy's SSH/SCP step fails with `handshake failed: unable to authenticate`.

```bash
gh secret set HETZNER_HOST  --repo "$GITHUB_REPO" --body "$SERVER_IP"
gh secret set HETZNER_USER  --repo "$GITHUB_REPO" --body "deploy"          # unchanged; harmless to re-set

# ONLY if you rotated the key in step 1 (or the deploy still fails auth after the
# new box has cert/id_hetzner.pub in authorized_keys):
gh secret set HETZNER_SSH_KEY --repo "$GITHUB_REPO" < cert/id_hetzner      # the PRIVATE key file
```

Then confirm the rest are still present (values aren't shown):

```bash
gh secret list --repo "$GITHUB_REPO"
```

You should see `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`,
`CLIENT_ORIGIN`, `GHCR_PAT`. If `GHCR_PAT` is older than ~a year it may have expired
(fine-grained PATs do) — regenerate at **GitHub → Settings → Developer settings →
Personal access tokens → Fine-grained**, scope `read:packages`, and
`gh secret set GHCR_PAT --repo "$GITHUB_REPO" --body "<new pat>"`.

`CLIENT_ORIGIN` must match `$CLIENT_ORIGIN` from `deploy/hetzner/config.env` (scheme +
host, no path) — it's the API's CORS allowlist.

## 5. Deploy

```bash
git commit --allow-empty -m "Redeploy to rebuilt server" && git push origin main
# or, without a commit:
gh workflow run deploy.yml --repo "$GITHUB_REPO"

gh run watch --repo "$GITHUB_REPO"
```

The `deploy_server` job builds + pushes the image, SCPs `docker-compose.prod.yml` +
`Caddyfile` to `/opt/visual-directory/`, writes `.env` from the secrets, runs
`docker compose -f docker-compose.prod.yml up -d`, then
`docker compose ... exec -T api pnpm prisma:deploy` to apply **all** migrations
(including `20260910155923_member_incomplete`) to the fresh DB.

## 6. Seed the first leader (one-time, manual)

Migrations run automatically; the seed never does. With no account you can't log in.

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP" \
  "cd /opt/visual-directory && docker compose -f docker-compose.prod.yml exec -T api sh -c \"SEED_LEADER_EMAIL=$LEADER_EMAIL pnpm seed\""
```

**Optional — start with a populated directory.** `pnpm seed:demo` wipes all
organisations + members and inserts the curated roster in
`backend/prisma/demo-data.ts` (accounts and the audit log are untouched). Edit
that file first if you want different data, then:

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP" \
  "cd /opt/visual-directory && docker compose -f docker-compose.prod.yml exec -T -e SEED_LEADER_EMAIL=$LEADER_EMAIL api pnpm seed:demo"
```

## 7. Verify

```bash
curl https://api.cowglow.io/health
# {"ok":true}
```

Check the latest migration applied (the `_prisma_migrations` table lists every one
that ran — `20260910155923_member_incomplete` should be the newest):

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP"
cd /opt/visual-directory
docker compose -f docker-compose.prod.yml exec api pnpm prisma migrate status
exit
```

Then open the live site (`https://cowglow.github.io/visual-directory/`), request a
magic link for the seeded email, and — since `RESEND_API_KEY` may be unset — grab the
link from the API logs:

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP" \
  'cd /opt/visual-directory && docker compose -f docker-compose.prod.yml logs --tail=50 api'
```

Log in, drop a normal pin and a Shift+click pin — you're back.

---

## Troubleshooting

| Symptom (in `gh run watch` or `curl`) | Cause / fix |
|---|---|
| `ssh: handshake failed: ... unable to authenticate, attempted methods [none publickey]` at the *Copy compose file* or *Deploy on Hetzner* step | `HETZNER_SSH_KEY` secret ≠ a key in the box's `authorized_keys`, or `HETZNER_HOST` is the old IP. Redo step 4 with the exact private-key file and new IP. Confirm locally first: `ssh -i "$SSH_KEY" deploy@"$SERVER_IP" whoami`. |
| `Error response from daemon: ... denied` / `manifest unknown` on `docker compose pull api` | `GHCR_PAT` expired or missing `read:packages`. Regenerate, `gh secret set GHCR_PAT`. |
| `curl https://api.cowglow.io/health` → TLS/cert error | DNS not resolving to the new box yet (step 3), or firewall not allowing `80`/`443`. Fix DNS/firewall, then `docker compose -f docker-compose.prod.yml restart caddy` on the box to retry the cert. |
| Deploy green but `/health` connection refused | `api` container crashed — `docker compose -f docker-compose.prod.yml logs api`. Usually a bad `DATABASE_URL` (check `POSTGRES_*` secrets are consistent) or the DB not healthy yet. |
| Login page loads but every request fails silently in the browser console (CORS) | `CLIENT_ORIGIN` secret doesn't exactly match the site origin — must be `https://cowglow.github.io`, no path, no trailing slash. Re-set it and redeploy. |

## When you tear it down again

1. Delete the server in the Hetzner Console (the `postgres-data` volume goes with it —
   `pg_dump` first if there's data worth keeping, see `HETZNER_DEPLOY.md` § Backups).
2. The `api` DNS record now points at nothing — harmless, you'll repoint it next
   rebuild.
3. GitHub secrets stay set; `HETZNER_HOST` is just stale (wrong IP) until the next run
   of this runbook. The keypair in `cert/` and the `HETZNER_SSH_KEY` secret carry over.
