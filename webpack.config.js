const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, "src", "index.tsx"),
  mode: 'development',
  output: {
    path:path.resolve(__dirname, "dist"),
  },
  resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      modules: [
          path.resolve('./node_modules')
        ]
  },
  module: {
    rules: [
        {
            test: /\.(t|j)sx?$/,
            use: {
                loader: 'ts-loader'
            },
            exclude: /node_modules/
        },
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
}