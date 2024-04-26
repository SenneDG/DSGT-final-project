const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');
const nodePackage = require('./package.json');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    allowedHosts: 'all',
    port: 8080,
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${nodePackage.version}/[name].js`,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: `${nodePackage.version}/static/images/[name][ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 15 * 1024,
          },
        },
      },
      {
        test: /\.(eot|ttf|otf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: `${nodePackage.version}/static/fonts/[name][ext]`,
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${nodePackage.version}/[name].css`,
      chunkFilename: `${nodePackage.version}/[id].css`,
    }),
  ],
});
