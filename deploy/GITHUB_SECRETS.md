# GitHub Actions secrets (both bbctool/lingxia-cms and bbctool/lingxia_home)

| Secret | Value |
|--------|-------|
| SERVER_HOST | 39.102.52.74 |
| SERVER_USER | root |
| SSH_PRIVATE_KEY | contents of deploy/keys/lingxia_deploy (NOT committed) |

## Server: add public key

```bash
# On 39.102.52.74
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "<paste deploy/keys/lingxia_deploy.pub>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Bootstrap (once)

```bash
# 1) On server — add deploy public key (see deploy/keys/lingxia_deploy.pub locally)
# 2) Run setup
bash /root/lingxia/lingxia-cms/deploy/setup-server.sh
# 3) Configure env
cp /root/lingxia/lingxia-cms/deploy/env.example /tmp/lingxia-env-ref
# Edit /root/lingxia/lingxia-cms/.env and lingxia_home/.env (match POSTGRES_PASSWORD from .env.db)
# 4) First deploy
bash /root/lingxia/lingxia-cms/deploy/first-deploy.sh
```

After GitHub Secrets are set, push to `main` triggers `/root/lingxia/deploy.sh`.
