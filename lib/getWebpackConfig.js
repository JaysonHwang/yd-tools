const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const deepAssign = require('deep-assign');
const chalk = require('chalk');
const replaceLib = require('./replaceLib');
const postcssConfig = require('./postcssConfig');

module.exports = function (modules) {
  const pkg = require(path.join(process.cwd(), 'package.json'));
  const babelConfig = require('./getBabelCommonConfig')(modules || false);

  const pluginImportOptions = [
    {
      style: true,
      libraryName: pkg.name,
      libraryDirectory: 'components',
    },
  ];

  if (pkg.name !== 'antd') {
    pluginImportOptions.push({
      style: true,
      libraryDirectory: 'es',
      libraryName: 'antd',
    });
  }
  if (pkg.name !== 'yd') {
    pluginImportOptions.push({
      style: true,
      libraryDirectory: 'es',
      libraryName: 'yd',
    });
  }

  babelConfig.plugins.push([
    require.resolve('babel-plugin-import'),
    pluginImportOptions,
  ]);

  if (modules === false) {
    babelConfig.plugins.push(replaceLib);
  }

  const config = {
    devtool: 'source-map',

    output: {
      path: path.join(process.cwd(), './dist/'),
      filename: '[name].js',
    },

    resolve: {
      modules: ['node_modules', path.join(__dirname, '../node_modules')],
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
      ],
      alias: {
        [pkg.name]: process.cwd(),
      },
    },

    node: [
      'child_process',
      'cluster',
      'dgram',
      'dns',
      'fs',
      'module',
      'net',
      'readline',
      'repl',
      'tls',
    ].reduce((acc, name) => Object.assign({}, acc, { [name]: 'empty' }), {}),

    module: {
      noParse: [/moment.js/],
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: babelConfig,
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: Object.assign(
                  {},
                  postcssConfig,
                  { sourceMap: true }
                ),
              },
            ],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: Object.assign(
                  {},
                  postcssConfig,
                  { sourceMap: true }
                ),
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
      ],
    },

    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css',
        disable: false,
        allChunks: true,
      }),
      new CaseSensitivePathsPlugin(),
      new webpack.BannerPlugin('winter is coming'),
      new webpack.ProgressPlugin((percentage, msg, addInfo) => {
        const stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write(`📦  ${chalk.magenta(msg)} (${chalk.magenta(addInfo)})`);
          stream.clearLine(1);
        } else if (percentage === 1) {
          console.log(chalk.green('\nwebpack: bundle build is now finished.'));
        }
      }),
    ],
  };

  if (process.env.RUN_ENV === 'PRODUCTION') {
    const entry = ['./index'];
    config.entry = {
      [`${pkg.name}.min`]: entry,
    };
    config.externals = {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    };
    config.output.library = pkg.name;
    config.output.libraryTarget = 'umd';

    const uncompressedConfig = deepAssign({}, config);

    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        output: {
          ascii_only: true,
        },
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ]);

    uncompressedConfig.entry = {
      [pkg.name]: entry,
    };

    uncompressedConfig.plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }));

    return [config, uncompressedConfig];
  }

  return config;
};
