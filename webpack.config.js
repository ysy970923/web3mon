// 웹팩이 실행될 때 참조하는 파일
const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // enntry file
  entry: './src/main.js',
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage', // 필요한 폴리필만 추가
                  corejs: 3
                }
              ]
            ]
          }
        }
      }
    ]
  },

  // plugins: [new NodePolyfillPlugin()],
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
  devtool: 'source-map',
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development'
}
