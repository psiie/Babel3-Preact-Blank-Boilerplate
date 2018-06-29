if (process.env.NODE_ENV === 'production') process.exit(0); // No need to build the DLL in production

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const pkg = require(path.join(process.cwd(), 'package.json'));

const outputPath = path.join(process.cwd(), pkg.dllPlugin.path);
const dllManifestPath = path.join(outputPath, 'package.json');
const manifestText = JSON.stringify({
  name: 'react-dlls',
  private: true,
  author: pkg.author,
  repository: pkg.repository,
  version: pkg.version,
});

shell.mkdir('-p', outputPath);
shell.echo('Building the Webpack DLL...');

/* Create a manifest so npm install doesn't warn us */
if (!fs.existsSync(dllManifestPath)) {
  fs.writeFileSync(dllManifestPath, manifestText, 'utf8');
}

shell.exec('cross-env BUILDING_DLL=true webpack --display-chunks --color --config internals/webpack/dll.js --hide-modules');
