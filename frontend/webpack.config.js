import path from "path";
const __dirname = import.meta.dirname;

export default {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
  },
};
