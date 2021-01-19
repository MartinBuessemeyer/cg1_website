'use strict';

const { merge } = require('webpack-merge');
const { pages, common } = require('./webpack.common.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
  const plugins = pages().map(p => new HtmlWebpackPlugin(p));
  return merge(common(env), {
    plugins,
    mode: 'development',
  });
};
