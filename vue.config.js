module.exports = {
  configureWebpack: {
    devServer: {
      port: 8080,
      watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
      },
    },
  }
}