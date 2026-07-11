# Task brief: rotate Hetzner deploy key + lock down root SSH

Hand this file to the session that has actual SSH/`gh` access to execute
against. It's a one-off runbook, not permanent project docs — delete it once
done.

## Context

`Publish Site` (`.github/workflows/deploy.yml`, `deploy_server` job) deploys
the API to a Hetzner VPS via `appleboy/scp-action` + `appleboy/ssh-action`,
authenticating with the `HETZNER_SSH_KEY` secret as `HETZNER_USER` (currently
`root`). Last run failed with:

```
ssh.ParsePrivateKey: ssh: this private key is passphrase protected
ssh: handshake failed: ssh: unable to authenticate, attempted methods [none], no supported methods remain
```

The private key currently in `HETZNER_SSH_KEY` has a passphrase — these
actions can't unlock one non-interactively. Root cause fix + a security
cleanup (moving off root for SSH) are bundled into one pass below.

Reference docs already in this repo:
- `docs/HETZNER_DEPLOY.md` — full original server setup, including secrets
  table and the "create a `deploy` user" note in step 3.
- `docs/HETZNER_ROOT_LOCKDOWN.md` — the detailed, safety-checked procedure for
  moving off root SSH without risking lockout. **Follow that file's ordering
  exactly** (it has a "verify in a second terminal before closing the first"
  safeguard) — this task brief is just the checklist tying it to the key
  rotation.

## Prerequisites this session needs

- SSH access to the Hetzner box good enough to add a new key to
  `authorized_keys` (current root/deploy access, or Hetzner Cloud Console web
  terminal as a fallback).
- `gh` authenticated against `cowglow/visual-directory` with permission to
  write repo secrets (`gh auth status`; `gh secret list --repo
  cowglow/visual-directory` should succeed).
- Ability to run `ssh-keygen` locally.

## Checklist

1. **Generate a new passphrase-free key**
   ```bash
   rm -f ~/.ssh/id_hetzner ~/.ssh/id_hetzner.pub   # only if the old attempt's files are stale/wrong
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/id_hetzner -N ""
   ```

2. **Create/confirm the non-root `deploy` user** on the server per
   `HETZNER_ROOT_LOCKDOWN.md` §1, and authorize the new public key for it
   (§2) — not for `root`. Keep an existing working session open as fallback.

3. **Verify in a second terminal** (`HETZNER_ROOT_LOCKDOWN.md` §3):
   ```bash
   ssh -i ~/.ssh/id_hetzner deploy@YOUR_SERVER_IP
   docker ps       # works without sudo
   sudo -l         # deploy has sudo
   ```

4. **Update GitHub secrets**:
   ```bash
   gh secret set HETZNER_SSH_KEY --repo cowglow/visual-directory < ~/.ssh/id_hetzner
   gh secret set HETZNER_USER --repo cowglow/visual-directory --body "deploy"
   ```

5. **Re-run the deploy workflow** and confirm it goes green end-to-end (image
   build/push, scp, ssh, migration):
   ```bash
   gh workflow run deploy.yml --repo cowglow/visual-directory   # or push a small commit to main
   gh run watch --repo cowglow/visual-directory
   ```
   Don't proceed to step 6 until this is confirmed working — you want the
   automated path proven on the `deploy` user before restricting root.

6. **Disable root SSH login** per `HETZNER_ROOT_LOCKDOWN.md` §5–6, verifying
   from a fresh terminal that `deploy` still works and `root` is refused
   before closing the fallback session.

7. **Clean up**: delete the old passphrase-protected key locally if it's
   still sitting around, and delete this file (`docs/HETZNER_KEY_ROTATION_TASK.md`)
   once everything above is confirmed done.

## Done when

- [ ] `Publish Site` workflow succeeds on `main` using the `deploy` user.
- [ ] `ssh root@YOUR_SERVER_IP` is refused.
- [ ] `ssh -i ~/.ssh/id_hetzner deploy@YOUR_SERVER_IP` works.
- [ ] Hetzner Cloud Console root access confirmed still available as a
      fallback (not removed — see `HETZNER_ROOT_LOCKDOWN.md`'s rationale).