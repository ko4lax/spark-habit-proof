module.exports = {
  apps: [
    {
      name: "spark-habit-proof",
      cwd: "/root/projects/spark-habit-proof",
      script: "npm",
      args: "run start",
      env: {
        PORT: 3470,
        NODE_ENV: "production",
      },
    },
  ],
};
