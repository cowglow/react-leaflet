# Disabling root SSH login on the Hetzner box

This is a follow-up hardening step for the server set up in
[`HETZNER_DEPLOY.md`](./HETZNER_DEPLOY.md). The goal: stop `root` from being
reachable over SSH at all, while keeping the account itself intact for
emergency access via the Hetzner Cloud Console (web-based root console/rescue
system, independent of SSH).

**Do not delete or lock the root account.** On a single VPS, root is your
last-resort recovery path if the non-root user or `sudo` ever breaks. Deleting
it turns a fixable mistake into a full server rebuild. Disabling *SSH* access
to it is the actual security win someone was recommending — full account
removal is not standard practice here and adds real risk for no extra benefit.

## Before you start

Confirm you have a fallback that doesn't depend on the SSH key you're about
to restrict:

- Hetzner Cloud Console → your server → **Console** tab gives you a browser
  root shell even with SSH fully locked down. Know how to get there before
  proceeding.
- Keep your current SSH session to the box open in one terminal window while
  you test the new setup in a second window. Never close the session you know
  works until you've verified the replacement works.

## 1. Create (or confirm) a non-root deploy user

If you already followed step 3 of `HETZNER_DEPLOY.md`, this user (and the
sudoers rule below) already exists — skip to step 2. If not, as `root`:

```bash
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
usermod -aG sudo deploy
echo 'deploy ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/deploy
chmod 0440 /etc/sudoers.d/deploy
visudo -cf /etc/sudoers.d/deploy
```

`docker` group membership lets it run `docker compose` without `sudo`; `sudo`
group is for occasional admin tasks (editing `sshd_config`, installing
packages) — including the `sshd_config` edit in step 5 below.

Use `--disabled-password --gecos ""` rather than plain `adduser deploy`: this
account only ever authenticates over SSH via key (step 2), so it doesn't need
a working Unix password, and `adduser` otherwise prompts interactively for one
(easy to Ctrl-C out of, which leaves a half-created user blocking a retry —
`deluser --remove-home deploy` cleans that up if it happens). That also means
`deploy` can't satisfy an interactive `sudo` password prompt, which is exactly
why the `sudoers.d` drop-in above grants it passwordless sudo instead —
`visudo -cf` validates the file's syntax before it takes effect, so a typo
can't lock `sudo` out entirely.

## 2. Authorize the deploy key for `deploy`, not `root`

Using the new key pair from the rotation you just did (`id_hetzner` /
`id_hetzner.pub`):

```bash
# from your local machine
ssh-copy-id -i cert/id_hetzner.pub deploy@YOUR_SERVER_IP
```

Or, already logged in as root on the box:

```bash
mkdir -p /home/deploy/.ssh
cat >> /home/deploy/.ssh/authorized_keys   # paste the .pub contents, then Ctrl-D
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

## 3. Verify the deploy user works — in a new terminal

Keep your existing root session open. In a **separate** terminal:

```bash
ssh -i cert/id_hetzner deploy@YOUR_SERVER_IP
docker ps            # should work without sudo
sudo -l               # should show deploy has sudo rights
```

Don't move to step 4 until this succeeds.

## 4. Point GitHub Actions at the deploy user

Update the `HETZNER_USER` secret (Settings → Secrets and variables → Actions)
from `root` to `deploy`. Re-run the `Publish Site` workflow and confirm the
deploy still succeeds end-to-end (image pull, `.env` write, migration) before
touching `sshd_config` — you want the automated path proven on the new user
first.

## 5. Disable root SSH login

Still keeping your original root session open as a fallback, edit
`/etc/ssh/sshd_config` (as root, or `sudo` as `deploy`):

```bash
sudo sed -i \
  -e 's/^#\?PermitRootLogin.*/PermitRootLogin no/' \
  -e 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' \
  /etc/ssh/sshd_config
sudo systemctl restart sshd
```

`PermitRootLogin no` blocks SSH as root entirely (key or password).
`PasswordAuthentication no` disables password auth for all users, forcing key-
only login — do this only once you've confirmed the `deploy` key works (step
3), since it also affects non-root logins.

## 6. Verify again, from a fresh terminal

```bash
ssh -i cert/id_hetzner deploy@YOUR_SERVER_IP   # should work
ssh root@YOUR_SERVER_IP                           # should be refused
```

Only close your original fallback root session once both checks above pass.
If `deploy` access is ever lost afterward, the Hetzner Cloud Console web
terminal (step "Before you start") still gets you in as root to fix it.

## Rollback

If something goes wrong before you've confirmed step 6, use the Hetzner
Console to log in as root and revert:

```bash
sudo sed -i \
  -e 's/^PermitRootLogin no/PermitRootLogin yes/' \
  -e 's/^PasswordAuthentication no/PasswordAuthentication yes/' \
  /etc/ssh/sshd_config
sudo systemctl restart sshd
```