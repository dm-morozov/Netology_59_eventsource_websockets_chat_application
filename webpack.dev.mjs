// webpack.dev.mjs          # Конфигурация для разработки Webpack

export default {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./result",
    open: true,
    port: 3000,
  }
};
