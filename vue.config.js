module.exports = {
  publicPath: 'https://wisdomconnect.azurewebsites.net/',

  devServer: {
    host:'0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://ericbackend.azurewebsites.net/',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  }
}
