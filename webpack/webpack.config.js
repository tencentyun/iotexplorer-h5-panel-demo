const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

class ModifiedMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject(mainChunk) {
    return {}
  }
}

module.exports = (env, argv) => {
  const { mode } = env;
  const { demo } = argv;
  console.log(`正在打开${demo || ''}`);

  const isDevMode = mode === 'development';
  const srcPath = path.join(__dirname, `../src/${demo || ''}`);
  const distPath = path.join(__dirname, '../dist', isDevMode ? '/debug' : '/release');

  // 当 JS 文件大小超过 2MB 限制时，可置为 true 开启 webpack 的代码拆分
  // 开启后 npm run release 将输出多个文件，需要全部上传到控制台交互开发的设置项中
  // 具体设置项在 optimization.splitChunks
  const enableCodeSplitting = false;

  console.log('srcPath', srcPath);
  console.log('distPath', distPath);

  return {
    name: 'iot-explorer-h5-panel-sdk-demo',
    mode,
    entry: {
      index: path.join(srcPath, '/app.jsx'),
    },
    output: {
      path: distPath,
      filename: '[name].js',
      libraryTarget: 'umd'
    },
    externals: {
      'qcloud-iotexplorer-h5-panel-sdk': 'h5PanelSdk',
    },
    devServer: {
      contentBase: distPath,
      compress: true,
      port: 9000,
      disableHostCheck: true, //  新增该配置项
      // hot: true,
      https: true,
    },
    module: {
      // 现在的 babel 配置已经很简单了，我们只需要加入默认的配置即可
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules|vendors/,
          use: {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                [
                  '@babel/plugin-transform-runtime',
                  {
                    'absoluteRuntime': false,
                    'corejs': false,
                    'helpers': true,
                    'regenerator': true,
                    'useESModules': false,
                  }
                ],
              ]
            },
          }
        },
        {
          test: /\.(le|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [require('autoprefixer')()],
              },
            },
            {
              loader: 'less-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      // 添加 jsx 后缀支持
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devtool: isDevMode ? 'inline-source-map' : 'inline-nosources-source-map',
    optimization: enableCodeSplitting && !isDevMode ?
      {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/](react|react-dom|qcloud-iotexplorer-h5-panel-sdk)[\\/]/,
              name: 'vendor',
              chunks: 'all',
            }
          }
        }
      } : {},
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new ModifiedMiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          autoprefixer: { disable: true },
        },
      }),
      // new BundleAnalyzerPlugin(),
      // new CopyPlugin([
      //   {
      //     from: path.join(srcPath, '/project.config.json'),
      //     to: path.join(distPath, '/project.config.json'),
      //   },
      //   {
      //     from: path.join(srcPath, '/plugin/plugin.json'),
      //     to: path.join(distPath, '/plugin'),
      //   },
      //   {
      //     from: path.join(srcPath, '/doc'),
      //     to: path.join(distPath, '/doc'),
      //   },
      //   {
      //     from: path.join(srcPath, '/miniprogram'),
      //     to: path.join(distPath, '/miniprogram'),
      //   },
      // ]),
    ],
    stats: { children: false },
  };
};
