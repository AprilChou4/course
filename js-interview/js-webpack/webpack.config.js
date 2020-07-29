module.exports = {
  entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
  devtool: "eval-source-map", //调试模式
  output: {
    path: __dirname + "/public", //打包后的文件存放的地方
    filename: "bundle.js", //打包后输出文件的文件名
  },
  //   本地服务器
  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新
    port: 8888,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              // 以前版本是通过 true 开启，相关配置接着写
              // modules: true, // 指定启用css modules
              // localIdentName: "[name]__[local]--[hash:base64:5]", // 指定css的类名格式
              // 现在是给 modules 一个 options 对象开启
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]", // 指定css的类名格式
              },
            },
          },
        ],
      },
    ],
  },
};
