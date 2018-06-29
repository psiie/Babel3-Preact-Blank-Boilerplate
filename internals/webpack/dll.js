const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const pkg = require(path.join(process.cwd(), 'package.json'));

const dllConfig = pkg.dllPlugin;
const outputPath = path.join(process.cwd(), dllConfig.path);

if (!pkg.dllPlugin) { process.exit(0); }

function getDependencies() {
  const dependencyNames = Object.keys(pkg.dependencies);
  const exclude = pkg.dllPlugin.exclude;
  const include = pkg.dllPlugin.include;
  const includeDependencies = _.uniq(dependencyNames.concat(include));

  return {
    reactDeps: _.pullAll(includeDependencies, exclude),
  };
}

module.exports = require('./base')({
  context: process.cwd(),
  entry: getDependencies(pkg),
  devtool: 'eval',
  output: {
    filename: '[name].dll.js',
    path: outputPath,
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(outputPath, '[name].json'),
    }),
  ],
  performance: { hints: false },
});
