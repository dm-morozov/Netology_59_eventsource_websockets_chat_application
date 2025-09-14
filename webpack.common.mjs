// webpack.common.mjs       # Общая конфигурация Webpack

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);

export default {
  entry: "./src/index.ts", // Указали точку входа index.ts
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      // Добавили правило для обработки .ts с помощью ts-loader
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      // заставит Webpack копировать картинки в dist/ 
      // и возвращать путь к ним.
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },      
    ]
  },
  resolve: {
    // Webpack теперь понимает .ts
    extensions: ['.ts', '.js'], // Добавили .ts
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ]
};
