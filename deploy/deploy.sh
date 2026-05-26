#!/usr/bin/env bash
# Deploy lingxia test server (PM2 + Docker Postgres)
# Usage: /root/lingxia/deploy.sh cms|home|all
#
# Does NOT run payload migrate or seed — apply manually when schema/data changes:
#   cd /root/lingxia/lingxia-cms && npm run payload migrate && npm run seed
set -euo pipefail

TARGET="${1:-all}"
ROOT="/root/lingxia"

deploy_cms() {
  cd "$ROOT/lingxia-cms"
  git fetch origin main
  git reset --hard origin/main
  install -m 755 deploy/deploy.sh "$ROOT/deploy.sh"
  npm ci
  # DB migrate/seed are manual: npm run payload migrate && npm run seed
  npm run build
  pm2 reload lingxia-cms --update-env || pm2 start "$ROOT/ecosystem.config.cjs" --only lingxia-cms
}

deploy_home() {
  cd "$ROOT/lingxia_home"
  git fetch origin main
  git reset --hard origin/main
  npm ci
  npm run build
  pm2 reload lingxia-home --update-env || pm2 start "$ROOT/ecosystem.config.cjs" --only lingxia-home
}

case "$TARGET" in
  cms) deploy_cms ;;
  home) deploy_home ;;
  all) deploy_cms; deploy_home ;;
  *)
    echo "usage: deploy.sh cms|home|all"
    exit 1
    ;;
esac

pm2 save
pm2 status
