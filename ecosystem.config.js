module.exports = {
  apps: [
    {
      name: "ffiv",
      script: "./dist/main.js",
      instances: 1,
      exec_mode: "cluster",
      log_file: "./logs/ffiv-combined.log",
      out_file: "./logs/ffiv-out.log",
      error_file: "./logs/ffiv-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
  ],
};
