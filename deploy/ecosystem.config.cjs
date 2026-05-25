/** PM2 config — copy or symlink to /root/lingxia/ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "lingxia-cms",
      cwd: "/root/lingxia/lingxia-cms",
      script: "node_modules/.bin/next",
      args: "start -p 9001",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 9001,
        HOSTNAME: "0.0.0.0",
        NODE_OPTIONS: "--no-deprecation",
      },
      max_memory_restart: "800M",
      instances: 1,
      autorestart: true,
    },
    {
      name: "lingxia-home",
      cwd: "/root/lingxia/lingxia_home",
      script: "node_modules/.bin/next",
      args: "start -p 9000",
      exec_mode: "fork",
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
