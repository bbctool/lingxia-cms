#!/usr/bin/env bash
# One-time server bootstrap for test env (run on 39.102.52.74 as root)
set -euo pipefail

ROOT="/root/lingxia"
REPO_CMS="$ROOT/lingxia-cms"
REPO_HOME="$ROOT/lingxia_home"

echo "==> Ensure Node 20 + PM2"
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v
npm install -g pm2

echo "==> Clone repos"
mkdir -p "$ROOT"
if [[ ! -d "$REPO_CMS/.git" ]]; then
  git clone https://github.com/bbctool/lingxia-cms.git "$REPO_CMS"
fi
if [[ ! -d "$REPO_HOME/.git" ]]; then
  git clone https://github.com/bbctool/lingxia_home.git "$REPO_HOME"
fi

echo "==> Link deploy artifacts"
cp "$REPO_CMS/deploy/ecosystem.config.cjs" "$ROOT/ecosystem.config.cjs"
cp "$REPO_CMS/deploy/docker-compose.db.yml" "$ROOT/docker-compose.db.yml"
install -m 755 "$REPO_CMS/deploy/deploy.sh" "$ROOT/deploy.sh"

if [[ ! -f "$ROOT/.env.db" ]]; then
  echo "POSTGRES_PASSWORD=$(openssl rand -hex 16)" > "$ROOT/.env.db"
  echo "Created $ROOT/.env.db — update lingxia-cms/.env DATABASE_URI with this password"
fi

echo "==> Start Postgres"
docker compose -f "$ROOT/docker-compose.db.yml" --env-file "$ROOT/.env.db" up -d

echo "==> Next steps (manual):"
echo "  1. Copy deploy/env.example → lingxia-cms/.env and lingxia_home/.env (fill secrets)"
echo "  2. bash $REPO_CMS/deploy/first-deploy.sh          # build + PM2 (no DB migrate/seed)"
echo "  3. cd $REPO_CMS && npm run payload migrate && npm run seed"
echo "  4. pm2 restart lingxia-cms"
echo "  5. Open http://39.102.52.74:9001/admin"
