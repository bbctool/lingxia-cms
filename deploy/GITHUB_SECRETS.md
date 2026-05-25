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
bash /root/lingxia/lingxia-cms/deploy/setup-server.sh
# then configure .env from deploy/env.example, migrate, seed, pm2 start
```

`deploy/keys/` is gitignored.
