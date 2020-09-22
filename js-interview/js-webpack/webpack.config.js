const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: ['babel-polyfill', __dirname + '/app/main.js'], //已多次提及的唯一入口文件
  devtool: 'eval-source-map', //调试模式
  output: {
    // path: __dirname + '/public', //打包后的文件存放的地方
    // filename: 'bundle.js', //打包后输出文件的文件名
    filename: 'script/[name].chunk.[chunkhash:5].js',
    path: path.resolve(__dirname, './dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 将第三方模块提取出来
          test: /node_modules/,
          chunks: 'initial',
          name: 'common',
          priority: 10, // 优先级
          enforce: true,
        },
      },
    },
  },
  //   本地服务器
  devServer: {
    contentBase: './public', //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    port: 8888,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
          query: {
            babelrc: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // 以前版本是通过 true 开启，相关配置接着写
              // modules: true, // 指定启用css modules
              // localIdentName: "[name]__[local]--[hash:base64:5]", // 指定css的类名格式
              // 现在是给 modules 一个 options 对象开启
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]', // 指定css的类名格式
              },
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
};
