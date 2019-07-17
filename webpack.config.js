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

// module.exports = {
//     entry: ['babel-polyfill', entryFile],
//     output: {
//         filename: 'bundle.js',
//         path: outputDir
//     },
//     // resolve: {
//     //     modules: [
//     //         path.resolve("./src"),
//     //         "node_modules",
//     //     ],
//     // },
//     module: {
//         rules: [
//             {
//                 test: /\.jsx?$/,
//                 exclude: /node_modules/,
//                 loader: "babel-loader",
//             },
//             {
//                 test: /\.(scss|css)$/,
//                 use: [
//                    {
//                     loader : MiniCssExtractPlugin.loader,
//                    }, 
//                    { 
//                      loader: 'css-loader',
//                    }, 
//                    { 
//                       loader: 'sass-loader' 
//                    }
//                  ]
//             }
//             // {
//             //     //test: /\.scss$/,
//             //     test: /\.(scss|css)$/,
//             //     exclude: /node_modules/,
//             //     use: [
//             //       "style-loader",
//             //       MiniCssExtractPlugin.loader,
//             //       "css-loader",
//             //       "sass-loader"
//             //     ]
//             // }
//         ],
//     },
//     plugins: [
//         new MiniCssExtractPlugin({
//           filename: 'styles.css',
//         }),
//         new webpack.DefinePlugin({
//             //'process.env.BROWSER' : JSON.stringify(true),
//             "process.env": {
//                 BROWSER: JSON.stringify(true)
//             },
//             "SARASA": JSON.stringify("ASD")
//         }),
//         new webpack.EnvironmentPlugin({
//             BROWSER: true,
//           })
//       ],
// };