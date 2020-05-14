const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
	const { mode } = env;

	const isDevMode = mode === 'development';
	const srcPath = path.join(__dirname, '../src');
	const distPath = path.join(__dirname, '../dist', isDevMode ? '/debug' : '/release');

	console.log('srcPath', srcPath);
	console.log('distPath', distPath);

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
			disableHostCheck: true, //  新增该配置项
			// hot: true,
			https: true,
		},
		module: {
			// 现在的 babel 配置已经很简单了，我们只需要加入默认的配置即可
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules|vendors/,
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
			// 添加 jsx 后缀支持
			extensions: [".js", ".jsx", '.ts'],
		},
		devtool: "inline-source-map",
		optimization: {},
		plugins: [
			new webpack.ProgressPlugin(),
			new CleanWebpackPlugin(),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
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
	};
};
