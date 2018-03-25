const common = require('./webpack.common.js');

const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
	module: {
		rules: [{
				test: /\.(gif|png|jpe?g|svg)$/i,
			  use: [
			    'file-loader?name=../images/[name].[ext]',
			    {
			      loader: 'image-webpack-loader',
			      options: {
			        mozjpeg: {
			          progressive: true,
			          quality: 65,
			        },
			        optipng: {
			          enabled: false,
			        },
			        pngquant: {
			          quality: '65-90',
			          speed: 4
			        },
			        gifsicle: {
			          interlaced: false,
			        },
			        webp: {
			          quality: 75
			        }
			      }
			    },
			  ],
			}, {
				test:/\.(s*)css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								url: false,
								minimize: false,
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				})
			}]
	},
	plugins: [
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8080,
			notify: false,
			server: { baseDir: [__dirname+'/dist'] }
		}),
	]
});
