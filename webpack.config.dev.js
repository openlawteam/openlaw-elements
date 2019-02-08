const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: {
    example: './example/index'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'static/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './example/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src')
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader?modules', 'postcss-loader'],
      //   include: path.join(__dirname, 'source')
      // },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader?minimize=false'],
      //   include: path.join(__dirname, 'styles.css')
      // }
    ]
  },
  devServer: {
    contentBase: 'build',
    port: 3001
  },
};
