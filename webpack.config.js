'use strict'
const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
    entry: './src/js/lecture_1.js',
    devtool: 'inline-source-map',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
            },
            {
                test: /\.pug$/,
                use: {
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
                },
            },
        ]
	},
	plugins: [
        new MonacoWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/lecture_1.pug"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/css', to: './css' },
                { from: 'src/img', to: './img', }
            ]
        })
    ],
    resolve: {
        extensions: [".js", ".ts", ".scss", ".css", ".pug"]
    },
};
