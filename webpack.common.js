const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src/js/elegance_css.js'),
	output: {
		path: path.resolve(__dirname, 'dist/assets/js'),
		filename: 'elegance_css.js',
	},
	externals: [
		{
			'window': 'window'
		}
	],
	resolve: {
		extensions: ['.js'],
		alias: {
			'core': path.resolve(__dirname, 'src/js/core.js')
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			'core': 'core'
		}),
		new ExtractTextPlugin({
			filename: '../css/elegance.css'
		})
	]
}
