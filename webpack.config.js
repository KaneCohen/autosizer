const path = require('path');

module.exports = {
  entry: './dist/index.js',
  target: 'web',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist.browser'),
    libraryTarget: 'var',
    library: 'Autosizer',
  },
};
