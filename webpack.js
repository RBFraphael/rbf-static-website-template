const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/js/website.js',
  output: {
    path: path.resolve(__dirname, 'cache'),
    filename: 'release.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;