const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const { mode } = env;

  const isDevMode = mode === 'development';

  const srcPath = path.join(__dirname, '../src');
  const distPath = path.join(__dirname, '../dist', isDevMode ? '/debug' : '/release');

  return {
    name: 'iot-explorer-h5-panel-sdk-demo',
    mode,
    entry: path.join(srcPath, '/app.jsx'),
    output: {
      path: distPath,
      filename: 'index.js',
      libraryTarget: 'umd'
    },
    devServer: {
      contentBase: distPath,
      compress: true,
      port: 9000,
      disableHostCheck: true,
      https: true,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules|vendors|qcloud-iotexplorer-h5-panel-sdk/,
          use: {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                [
                  "@babel/plugin-transform-runtime",
                  {
                    "absoluteRuntime": false,
                    "corejs": false,
                    "helpers": true,
                    "regenerator": true,
                    "useESModules": false,
                  }
                ],
              ]
            }
          }
        },
        {
          test: /\.(le|c)ss$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: [require('autoprefixer')()],
              },
            },
            {
              loader: "less-loader",
            },
          ],
        },
        {
          test: /\.ts$/,
          exclude: /(node_modules|vendor)/,
          use: [
            {
              loader: 'ts-loader',
              options: {},
            }
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", '.ts'],
    },
    devtool: "inline-source-map",
    optimization: {},
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
