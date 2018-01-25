const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = require('./base')({
  entry: {
    app: path.join(process.cwd(), 'app/index.js'),
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  plugins: (() => {
    // Always plugins
    const plugins = [
      // new webpack.optimize.LimitChunkCountPlugin({maxChunks: 2}),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
      new BundleAnalyzerPlugin({ 'process.env.NODE_ENV': '"production"' }),
      // new webpack.optimize.MoxduleConcatenationPlugin(),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor',
      //   children: true,
      //   minChunks: 2,
      //   async: true,
      // }),
      // new HtmlWebpackPlugin({
      //   template: 'app/index.html',
      //   minify: {
      //     removeComments: true,
      //     collapseWhitespace: true,
      //     removeRedundantAttributes: true,
      //     useShortDoctype: true,
      //     removeEmptyAttributes: true,
      //     removeStyleLinkTypeAttributes: true,
      //     keepClosingSlash: true,
      //     minifyJS: true,
      //     minifyCSS: true,
      //     minifyURLs: true,
      //   },
      //   inject: true,
      // }),
    ];
    return plugins;
  })(),

  performance: {
    assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
});
