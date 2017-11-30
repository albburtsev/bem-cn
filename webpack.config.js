const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const project = require('./package.json');
const banner = _.template(
	'<%= name %> v<%= version %>\n' +
	'<%= description %>\n' +
	'@author <%= author.name %>, <%= author.url %>'
)(project);
const rootPath = path.resolve(__dirname);

const config = {
	entry: path.join(rootPath, 'src/bem-cn.ts'),
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: 'eslint'
			}
		],
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			}
		]
	},
	output: {
		path: path.join(rootPath, 'dist/'),
		filename: 'bem-cn.js',
		library: 'block',
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['', '.js']
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.BannerPlugin(banner)
	]
};

if (process.env.NODE_ENV === 'production') {
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compressor: {
			warnings: false
		}
	}));
}

module.exports = config;
