"use strict";
const path = require("path");
const dev = process.env.NODE_ENV !== "production";
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: dev ? "development" : "production",
  context: path.join( __dirname, "src" ),
  devtool: dev ? "none" : "source-map",
  entry: {
      app: "./client.js",
  },
  output: {
    path: path.resolve( __dirname, "dist" ),
    filename: "[name].bundle.js",
  },
  resolve: {
      modules: [
          path.resolve( "./src" ),
          "node_modules",
      ],
  },
  module: {
      rules: [
          {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: "babel-loader",
          },
          {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                //"style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'styles/fonts/'
                }
              }
            ]
          }
      ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.styles.css',
    }),
  ]
};
