# CI and deployment to the home server

PRs run lint, TypeScript checks, deployment safety tests, a production build, and
Chromium browser tests. The browser tests mock authentication requests so they do
not contact production. Successful builds on `main` publish a prerelease tagged
`deploy-<commit SHA>`, containing the tested site and its SHA-256 checksum. PRs
cannot publish deployments.

The local timer polls every five minutes. It deploys only the current `main`
commit with a complete release and a successful `ci-deploy.yml` run. Downloads
are checksum verified; invalid archives are rejected. The timer never pulls or
modifies this source checkout and never builds source code on the server.

## One-time activation

Run these on the computer that serves the website:

```sh
sudo bash /var/www/rps9.net/deploy/install.sh
sudo bash /opt/ryan-website-api/deploy/install.sh
```

The site installer copies the current live build into an initial release,
backs up the Nginx configuration, and changes only its static document root to
`/var/www/rps9-releases/current`. It validates and reloads Nginx, installs the
deployment timer, and disables lid-close sleep. It leaves API proxying intact.
Administrator authentication is required for this one-time setup.

After reviewing and pushing these repository changes, merge into `main`.
The first successful workflow publishes the release. The timer picks it up
within about five minutes. GitHub must allow Actions and the workflow's requested
`contents: write` permission. No personal access token, SSH key, GitHub runner,
router port, or GitHub secret is required. Release downloads are public, just
like this repository. The release files must never contain secrets.

In GitHub Settings > Rules > Rulesets, protect `main`, require a pull request,
and require the `Website checks` status check. That check appears after the
workflow first runs. Pushes directly to `main` also trigger deployment; the
ruleset is what enforces merges through PRs. GitHub settings are not configured
by the files in this repository.

## Operation and rollback

```sh
systemctl status rps9-site-deploy.timer
journalctl -u rps9-site-deploy.service -n 50
sudo systemctl start rps9-site-deploy.service
```

Each release gets its own directory. A symlink change activates it atomically.
Checks verify the served commit, homepage, and expected API authentication
response through Nginx. A failed check restores the old symlink. Previous hashed
assets are retained for browsers that already have a page open.

To manually roll back, stop the timer first so it cannot redeploy `main`:

```sh
sudo systemctl stop rps9-site-deploy.timer rps9-site-deploy.service
sudo -u website-deploy python3 /usr/local/lib/rps9-site-deploy/deploy.py \
  --config /etc/rps9-site-deploy.json --rollback
```

Fix or revert the change through a PR, then restart the timer. Releases are kept
on disk for rollback; monitor disk space and remove older inactive directories
as needed. Do not delete `current` or `previous` targets. The deployer code and
systemd units are installed as root-owned files. After editing them, rerun the
installer; deploying site files does not automatically install server code.

Builds use Node 22 in CI. For local checks:

```sh
npm ci
npm run lint
npm run typecheck
python3 -m unittest discover -s tests/deploy -v
npm run build
npx playwright install --with-deps chromium
npm run test:browser
```
