var DefinePlugin = require('webpack').DefinePlugin;
var ProvidePlugin = require('webpack').ProvidePlugin;
var optimize = require('webpack').optimize;
var path = require('path');

var definePlugins = new DefinePlugin({
  PROD: process.env.NODE_ENV === 'production'
});
var providePlugins = new ProvidePlugin({
   _: 'underscore',
   'window._': 'underscore',
   'windows._': 'underscore',
})

var config = {
  context: __dirname + '/app/src/scripts',
  entry: './portal.js',
  output: {
    path: path.resolve(__dirname, 'app/build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: [
        'ng-annotate-loader',
        'babel-loader'
      ]
    }, {
      test: /\.styl$/,
      include: path.join(__dirname, '/app/src/styles'),
      use: [
        'style-loader',
        {
          loader: "css-loader",
          options: {
             minimize: true
          }
        },
        'stylus-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: "css-loader",
          options: {
             minimize: true
          }
        }
      ]
    }, {
      test: /\.html$/,
      use: 'raw-loader'
    }, {
      test: /\.(jpe?g|png|gif)$/,
      exclude: /(node_modules)/,
      use: 'url-loader?limit=10000'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader?limit=10000&minetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'url-loader'
    }]
  },
  plugins: [
    definePlugins,
    providePlugins
  ],
  resolve: {
    extensions: ['.js', '.css']
  }
};

if (process.env.NODE_ENV === 'production') {
  config.output.path = __dirname + '/app/build';
  config.plugins.push(new optimize.UglifyJsPlugin({
    compress: { warnings: false }
  }));
}

module.exports = config;
