const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const S3Plugin = require('webpack-s3-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = require('./webpack.base.babel')({
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
      new webpack.optimize.ModuleConcatenationPlugin(),
      // new webpack.optimize.LimitChunkCountPlugin({maxChunks: 2}),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true,
      }),
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
    // declare local plugins and plugins only used for deployment to s3
    // const localBuildPlugins = [new BundleAnalyzerPlugin({ 'process.env.NODE_ENV': '"production"' })];
    // const deployPlugins = [
    //   new S3Plugin(
    //     (() => {
    //       const defaultOpt = {
    //         s3UploadOptions: {
    //           Bucket: buckets[process.env.DEPLOY] || buckets.DEV,
    //         },
    //       };
    //       const devOpt = {
    //         cloudfrontInvalidateOptions: {
    //           DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    //           Items: ['/*'],
    //         },
    //       };
    //       return Object.assign(defaultOpt, process.env.DEPLOY !== 'PROD' ? devOpt : {});
    //     })()
    //   ),
    // ];
    // return a combo of always plugins and the chosen build plugins.
    // if (process.env.DEPLOY === 'FALSE') return plugins; // If not deploying and just building on pipeline.
    // return plugins.concat(process.env.DEPLOY ? deployPlugins : localBuildPlugins);
  })(),

  performance: {
    assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
});
