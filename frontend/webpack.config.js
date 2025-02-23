import path from "path";
const __dirname = import.meta.dirname;
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
  },
  output: {
    path: path.resolve(__dirname, "..", "backend", "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template.html",
    }),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
  ],
};
