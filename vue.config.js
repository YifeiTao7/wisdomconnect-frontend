module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    host:'0.0.0.0',
    port: 8080,
    https:false,
    open:true,
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
