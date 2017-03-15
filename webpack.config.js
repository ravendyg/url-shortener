const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: './app-src/app',

  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
    library: 'app',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app-src')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        },
      },

      {
        test: '\.html$',
        use: [
          'htmllint-loader',
          {
            loader: 'html-loader',
            options: {}
          }
        ]
      },
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app-src')
    ],

    extensions: ['.js', '.jsx', '.css'],
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: false,

  context: __dirname,

  target: 'web',

  externals: [],

  stats: 'errors-only',

  plugins: [
  ],
}