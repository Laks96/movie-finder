const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/bundle.js'
  },
  devServer: {
    contentBase: 'dist',
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html'
    }),

  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "img"
          }
        }

      }



    ]
  },


}


