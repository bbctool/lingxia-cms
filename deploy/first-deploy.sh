#!/usr/bin/env bash
# First deploy after .env files are configured (run on test server)
#
# Does NOT run database migrate or seed — apply those manually once (see end of script).
set -euo pipefail

ROOT="/root/lingxia"
CMS="$ROOT/lingxia-cms"
HOME="$ROOT/lingxia_home"

[[ -f "$CMS/.env" ]] || { echo "Missing $CMS/.env — copy from deploy/env.example"; exit 1; }
[[ -f "$HOME/.env" ]] || { echo "Missing $HOME/.env — copy from deploy/env.example"; exit 1; }

cp "$CMS/deploy/ecosystem.config.cjs" "$ROOT/ecosystem.config.cjs"
install -m 755 "$CMS/deploy/deploy.sh" "$ROOT/deploy.sh"

docker compose -f "$ROOT/docker-compose.db.yml" --env-file "$ROOT/.env.db" up -d

cd "$CMS"
npm ci
npm run build

cd "$HOME"
npm ci
npm run build

cd "$ROOT"
pm2 start ecosystem.config.cjs || pm2 reload ecosystem.config.cjs
pm2 save

cat <<EOF

Done. Services started (build + PM2 only).

==> Database setup (manual — required before CMS admin works):

  cd $CMS
  npm run payload migrate    # apply schema migrations
  npm run seed               # RBAC, site, sample content

  pm2 restart lingxia-cms

CMS:  http://39.102.52.74:9001/admin
Home: http://39.102.52.74:9000/zh-Hans

GitHub Actions deploy (deploy.sh) also skips migrate/seed — run the same commands after schema changes.

EOF
