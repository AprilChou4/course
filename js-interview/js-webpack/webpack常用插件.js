import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'

// 生成html文件。将webpack中条目配置的相关入口大块和extract-text-webpack-plugin的css样式插入到该插件提供的模板或模板内容配置项指定的内容基础上生成一个html文件，具体插入方式是将样式链接插入到head元素中，脚本插入到head或者body中。
import HtmlWebpackPlugin from 'html-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

// 该插件会提取entry chunk中所有的require('*.css')，分离出独立的css文件。
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// webpack.BannerPlugin: 会在你编译生成后的js添加注释
// UglifyJSPlugin(new webpack.optimize.UglifyJsPlugin([options])): 解析/压缩/美化所有的js chunk，传入options可以满足更多的定制化需求

// CommonsChunkPlugin: 将公用的js文件提取出来
// CleanWebpackPlugin: 每次编译之前都会先清除掉之前的打包文件
