'use strict';
const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/js/lecture_1.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                // Taken from: https://webpack.js.org/loaders/sass-loader/
                test: /\.s(a|c)ss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ttf$/,
                use: ['file-loader'],
            },
            {
                test: /\.pug$/,
                use: {
                    loader: 'pug-loader',
                    options: {
                        pretty: true,
                    },
                },
            },
        ],
    },
    plugins: [
        new MonacoWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/lecture_1.pug',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/css', to: './css' },
                { from: 'src/img', to: './img' },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.scss', 'css', 'sass', '.pug'],
    },
};
