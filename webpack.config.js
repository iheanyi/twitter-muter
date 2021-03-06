var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

browser = process.env.BROWSER;

if (browser === 'chrome') {
  outputPath = __dirname + '/build/' + browser;
} else {
  outputPath = path.resolve(__dirname, './dist');
}

module.exports = {
  entry: {
    popup: './src/popup/main.js',
    content: './src/content/index.js',
    background: './src/background/index.js'
  },
  output: {
    path: outputPath,
    publicPath: '/dist/',
    filename: '[name].js'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file',
        query: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      'css-cursors': 'css-cursors/css/cursors.css'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup.template.html',
      inject: false
    })
  ])
}
