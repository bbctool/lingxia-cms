/** PM2 config — copy or symlink to /root/lingxia/ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "lingxia-cms",
      cwd: "/root/lingxia/lingxia-cms",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 9001,
        HOSTNAME: "0.0.0.0",
      },
      max_memory_restart: "800M",
      instances: 1,
      autorestart: true,
    },
    {
      name: "lingxia-home",
      cwd: "/root/lingxia/lingxia_home",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 9000,
        HOSTNAME: "0.0.0.0",
      },
      max_memory_restart: "800M",
      instances: 1,
      autorestart: true,
    },
  ],
};
