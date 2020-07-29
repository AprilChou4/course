/**
 * @func 开发环境配置
 */

const webpack = require('webpack');
const theme = require('./theme/default');

module.exports = {
  entry: 'index',
  mode: 'development',
  devServer: {
    port: 8026,
    host: '0.0.0.0',
    contentBase: './dist',
    clientLogLevel: 'warning',
    disableHostCheck: true, //  新增该配置项
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      // 页面地址
      basePath: JSON.stringify('/'),
      // 单点登录地址
      ssoUrl: JSON.stringify('//192.168.206.101/'),
      // 用户中心地址
      userCenter: JSON.stringify('//u.jss.com.cn/'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        include: /node_modules|public/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'postcss.config.js',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: theme,
            },
          },
        ],
      },
      {
        test: /\.(less|css)$/,
        exclude: /node_modules|public/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'postcss.config.js',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: theme,
            },
          },
        ],
      },
      {
        // test: /\.jsx?$/,
        // exclude: /node_modules/,
        // enforce: 'pre',
        // use: [
        //   {
        //     loader: 'eslint-loader'
        //   }
        // ]
      },
    ],
  },
};
