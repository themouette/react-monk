module.exports = {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: [
          'sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
        ],
      },
    ],
  }
};
