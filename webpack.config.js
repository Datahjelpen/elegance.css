const path = require('path');
const webpack = require("webpack");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src')+'/js/app.js',
	output: {
		path: path.resolve(__dirname, 'dist/assets'),
		filename: 'app.js',
		publicPath: path.resolve(__dirname, 'dist/assets'),
	},
	module: {
		rules: [{
			test:/\.(s*)css$/,
			use: [
				{ loader: "style-loader" },
				{ loader: "css-loader"   },
				{ loader: "sass-loader"  }
			]
		}]
	},
	plugins: [
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8080,
			server: { baseDir: [__dirname+'/dist'] }
		}),
	]
}
