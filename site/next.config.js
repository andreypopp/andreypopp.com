let babelConfig = require('../babel.config');

// TODO: parametrize that!
let internalNodeModulesRegExp = /(?:ui)(?!.*node_modules)/;
let externalNodeModulesRegExp = /node_modules(?!\/(?:ui)(?!.*node_modules))/;

module.exports = {
  pageExtensions: ['js', 'md'],
  webpack: (config, { dev, isServer, defaultLoaders }) => {
    if (!defaultLoaders.babel.options.plugins) {
      defaultLoaders.babel.options.plugins = [];
    }
    defaultLoaders.babel.options.plugins.push(...babelConfig.plugins);

    config.resolve.symlinks = false;

    config.externals = config.externals || [];
    config.externals = config.externals.map(external => {
      if (typeof external !== 'function') return external;
      return (ctx, req, cb) =>
        internalNodeModulesRegExp.test(req) ? cb() : external(ctx, req, cb);
    });

    config.module.rules.push({
      test: /\.compute.js$/,
      use: [
        defaultLoaders.babel,
        {
          loader: 'value-loader',
          options: {}
        },
      ],
    });

    config.module.rules.push({
      test: /\.md$/,
      use: [
        defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: {}
        },
      ],
    });

    config.module.rules.push({
      test: /\.+(js|jsx)$/,
      use: defaultLoaders.babel,
      include: [internalNodeModulesRegExp],
    });

    // Alias all `react-native` imports to `react-native-web`
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };

    return config;
  },

  webpackDevMiddleware: config => {
    config.watchOptions.ignored = [
      // this is the same as in default but we don't ignore node_modules
      /[\\\/]\.git[\\\/]/,
      /[\\\/]\.next[\\\/]/,
    ];
    return config;
  },
};
