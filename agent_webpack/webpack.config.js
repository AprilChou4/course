const fs = require('fs');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');

const readdir = fs.readdirSync('./template');

// 是否是生产环境构建
const ENV_PROD = process.env.NODE_ENV === 'production';
const config = ENV_PROD ? prod : dev;
const entrys = {};
const resolvePath = (uri) => path.resolve(__dirname, uri);
const plugins = [
  new CopyWebpackPlugin([
    {
      from: `${__dirname}/public/`,
      to: `${__dirname}/dist/`,
    },
  ]),
];

readdir.forEach(function(val) {
  if (/\.ejs$/.test(val)) {
    const name = val.replace(/\.ejs$/, '');
    if (config.entry === '*' || config.entry === name || config.entry.includes(name)) {
      const filename = `./${name}.html`;
      const template = `./template/${val}`;
      entrys[name] = [
        'raf/polyfill',
        '@babel/polyfill/dist/polyfill',
        `./src/${name === 'index' ? 'home' : name}`,
      ];

      plugins.push(
        new HTMLWebpackPlugin({
          filename,
          template,
          chunks: [name, 'common'],
          minify: {
            // 移除空白
            collapseWhitespace: true,
            // 压缩css
            minifyCSS: true,
            // 压缩js
            minifyJS: true,
          },
        }),
      );
    }
  }
});

const homeRoot = 'src/home';

module.exports = webpackMerge(config, {
  entry: entrys,
  plugins,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.less', '.css'],
    alias: {
      '@': resolvePath('src'),
      '@public': resolvePath('src/public'),
      '@home': resolvePath(homeRoot),
      '@pages': resolvePath(`${homeRoot}/pages`),
      '@components': resolvePath(`${homeRoot}/public/components`),
      '@effects': resolvePath(`${homeRoot}/public/effects`),
      '@utils': resolvePath(`${homeRoot}/public/utils`),
      '@hooks': resolvePath(`${homeRoot}/public/hooks`),
      data: resolvePath(`${homeRoot}/public/data`),
      trackEvent: resolvePath(`${homeRoot}/public/trackEvent`),
    },
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
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        include: /nuijs/,
        use: [
          {
            loader: 'nui-loader',
          },
        ],
      },
      {
        test: /\.(svg|ttf|woff|eot)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:7].[ext]',
              outputPath: 'font/',
              publicPath: ENV_PROD ? '../font/' : '',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:7].[ext]',
              outputPath: 'images/',
              publicPath: ENV_PROD ? '../images/' : '',
            },
          },
        ],
      },
      {
        test: /\.html?$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  output: {
    filename: 'script/[name].chunk.[chunkhash].js',
    path: path.resolve(__dirname, './dist'),
  },
});
