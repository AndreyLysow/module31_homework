const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "bundle.[chunkhash].js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
<<<<<<< HEAD
    port: 3005,
=======
    port: 3000,
>>>>>>> origin/main
  },
  plugins: [
    new HTMLPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
<<<<<<< HEAD
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.svg$/, // Добавлено правило для SVG-файлов
        use: "svg-url-loader", // svg-url-loader для обработки SVG-файлов
=======
        test: /\.svg$/, // Добавлено правило для SVG-файлов
        use: "svg-url-loader", //  svg-url-loader для обработки SVG-файлов
>>>>>>> origin/main
      },
    ],
  },
};
