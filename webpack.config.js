const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = (env, options) => {
  const devMode =  options.mode !== 'production';
  return{
    entry: {
      index: ['./src/js/index.js']
    },
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool : 'inline-source-map',
    devServer: {
      contentBase:'./dist'
    },
    module:{
      rules:[
        {
          test:/\.js?$/,
          exclude: /node_modules/,
          use:{
            loader:"babel-loader",
            // options: {
            //   presets: ['@babel/preset-env']
            // }
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.html$/,
          use: [
              {
                  loader: 'html-loader',
                  options: {
                      //minimize: true
                  }
              }
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
                context: 'src'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], {exclude:['vendor']}),
      new MiniCssExtractPlugin({
        filename:'css/[name].css'
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html'
      }),
      new CopyWebpackPlugin([
        {from:'src/img',to:'img'} 
      ]) 
    ]
  }
}