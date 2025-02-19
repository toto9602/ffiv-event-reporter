module.exports = {
  name: "ffiv",
  script: "bun",
  args: "nest start",
  instances: 1,
  exec_mode: "fork",
  log_file: "./logs/ffiv-combined.log",
  out_file: "./logs/ffiv-out.log",
  error_file: "./logs/ffiv-error.log",
  log_date_format: "YYYY-MM-DD HH:mm:ss",
  merge_logs: true,
  env: {
    NODE_ENV: "production",
  },
};
