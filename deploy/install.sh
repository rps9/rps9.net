#!/usr/bin/env bash
# One-time setup on the computer that currently serves rps9.net.
set -euo pipefail
if [[ ${EUID} -ne 0 ]]; then
  echo "Run: sudo bash $0" >&2
  exit 1
fi
script_dir=$(cd -- "$(dirname -- "$0")" && pwd)
site=/etc/nginx/sites-available/rps9.net
root=/var/www/rps9-releases
command -v nginx >/dev/null
command -v python3 >/dev/null
test -f /var/www/rps9.net/dist/index.html
test -f "$site"
id website-deploy >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin website-deploy
install -d -m 0755 -o website-deploy -g website-deploy "$root"
install -d -m 0755 /usr/local/lib/rps9-site-deploy
install -m 0644 "$script_dir/deploy.py" /usr/local/lib/rps9-site-deploy/deploy.py
if [[ ! -L "$root/current" ]]; then
  test ! -e "$root/current"
  cp -a /var/www/rps9.net/dist "$root/initial"
  chown -R website-deploy:website-deploy "$root/initial"
  chmod -R a+rX "$root/initial"
  ln -s "$root/initial" "$root/current"
fi
cat > /etc/rps9-site-deploy.json <<'EOF'
{
  "kind": "site",
  "repo": "rps9/rps9.net",
  "root": "/var/www/rps9-releases",
  "health_url": "http://127.0.0.1/"
}
EOF
install -m 0644 "$script_dir/rps9-site-deploy.service" /etc/systemd/system/
install -m 0644 "$script_dir/rps9-site-deploy.timer" /etc/systemd/system/
# Preserve the original configuration, then change only the static document root.
backup="${site}.before-cicd-$(date -u +%Y%m%dT%H%M%SZ)"
cp -a "$site" "$backup"
python3 - "$site" <<'PY'
import sys
from pathlib import Path
path = Path(sys.argv[1])
text = path.read_text()
old = 'root /var/www/rps9.net/dist;'
new = 'root /var/www/rps9-releases/current;'
if old not in text and new not in text:
    raise SystemExit('Unexpected Nginx document root; refusing to change it')
path.write_text(text.replace(old, new))
PY
if ! nginx -t; then
  cp -a "$backup" "$site"
  exit 1
fi
systemctl reload nginx
if ! curl --fail --silent --show-error --max-time 15 -H 'Host: rps9.net' http://127.0.0.1/ -o /dev/null; then
  cp -a "$backup" "$site"
  systemctl reload nginx
  exit 1
fi
# This machine is a server: closing its lid must not suspend networking.
install -d /etc/systemd/logind.conf.d
cat > /etc/systemd/logind.conf.d/99-website-server-lid.conf <<'EOF'
[Login]
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
EOF
systemctl restart systemd-logind
systemctl daemon-reload
systemctl enable --now rps9-site-deploy.timer
echo 'Website deployment timer installed. It waits for tested releases on GitHub.'
