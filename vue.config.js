module.exports = {
  publicPath: './',
  outputDir: 'test', //打包输出目录
  assetsDir: './static', //放置生成的静态资源
  filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  lintOnSave: false, //设置是否在开发环境下每次保存代码时都启用 eslint验证


  devServer: {
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
