var webpack = require("webpack");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
	},
	output: {
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
