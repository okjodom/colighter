const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const isProduction = env?.production;

  return merge(
    {
      entry: {
        extension: './src/view/index.tsx',
        background: './src/ext_background.ts',
        colighter: './src/ext_contentscript.ts',
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          os: require.resolve('os-browserify/browser'),
          tty: require.resolve('tty-browserify'),
          util: false,
        },
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: 'svg-url-loader',
                options: {
                  limit: 10000,
                },
              },
            ],
          },
        ],
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        library: '[name]',
        // https://github.com/webpack/webpack/issues/5767
        // https://github.com/webpack/webpack/issues/7939
        devtoolNamespace: 'colighter',
        libraryTarget: 'umd',
        publicPath: '',
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new HtmlWebpackPlugin({
          template: './public/index.html',
          chunks: ['extension'],
          scriptLoading: 'defer',
          inject: 'head',
        }),
      ],
    },
    isProduction ? require('./webpack.prod') : require('./webpack.dev')
  );
};