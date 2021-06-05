module.exports = {
  apps: [
    {
      script: "./lib/index.js",
      name: "openmagicline",
      node_args: "-r dotenv/config",
    },
  ],
}
