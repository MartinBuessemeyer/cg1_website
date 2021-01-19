'use strict';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const pageList = require('./pages.json');

const pages = function () {
  return pageList.map(p => {
    return {
      title: p.title,
      filename: p.url + '.html',
      template: p.url + '.pug',
      templateParameters: {
        pages: pageList,
        activePage: p,
      },
    };
  });
};

const common = function (env) {
  const plugins = [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'lecture_1/data', to: 'lecture_1/data' },
        { from: 'lecture_1/js', to: 'lecture_1/js' },
      ],
    }),
    new MonacoWebpackPlugin(),
  ];

  return {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js'
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: {
            loader: 'pug-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.ttf$/,
          use: [
            {
              loader: 'file-loader',
            }
          ]
        }
      ],
    },
    plugins,
  };
};

module.exports = { pages, common };
