const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.tsx',
  devServer: {
    host: "0.0.0.0",
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: process.env.WEBPACK_PORT || 9000
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          'css-loader',
          'sass-loader'
        ]
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./index.html",
  })],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

