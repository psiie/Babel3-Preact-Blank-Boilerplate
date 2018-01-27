/* eslint-disable global-require */
const path = require('path');

function productionMiddleware(app, options) {
  const express = require('express');
  const compression = require('compression');
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
}

function developmentMiddleware(app, options) {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack/dev');
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  const fs = middleware.fileSystem; // Since webpackDevMiddleware uses memory-fs internally to store build artifacts, we use it instead
  app.get('*', (req, res) => fs.readFile(
    path.join(compiler.outputPath, 'index.html'), (err, file) => err ? res.sendStatus(404) : res.send(file.toString()))
  );
}

module.exports = (app, options) => {
  if (process.env.NODE_ENV === 'production') productionMiddleware(app, options)
  else developmentMiddleware(app, options);
  
  return app;
};
