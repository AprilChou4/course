/**
 * @func 生产或者测试环境配置
 */

const webpack = require('webpack');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CssSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const theme = require('./theme/default');

module.exports = {
  entry: '*',
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyjsPlugin({
        parallel: true,
        cache: true,
        uglifyOptions: {
          output: {
            comments: false,
            beautify: false,
          },
          compress: {
            // drop_console: true,
            drop_debugger: true,
            warnings: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
      // 页面地址
      basePath: JSON.stringify('/'),
      // 单点登录地址
      ssoUrl: JSON.stringify('//u.jss.com.cn/'),
      // 用户中心地址
      userCenter: JSON.stringify('//u.jss.com.cn/'),
    }),
    new CleanWebpackPlugin(['./dist']),
    new MiniCssExtractPlugin({
      chunkFilename: 'style/[name].[contenthash:20].css',
      filename: 'style/[name].css',
    }),
    // 由于IE9对单个css文件有选择器数量限制（4095个），以及大小限制（280kb），因此需要将css拆分
    new CssSplitWebpackPlugin({
      size: 2000,
      filename: 'style/[name].[part].css',
    }),
    new OptimizeCSSAssetsPlugin({
      //assetNameRegExp: /\.css$/g,
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        // 避免 cssnano 重新计算 z-index
        safe: true,
        // cssnano 集成了autoprefixer的功能
        // 会使用到autoprefixer进行无关前缀的清理
        // 关闭autoprefixer功能
        // 使用postcss的autoprefixer功能
        autoprefixer: false,
      },
      canPrint: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        include: /node_modules|public/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[hash:base64]',
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
    ],
  },
};
