import express from "express";
import cors from "cors";
import data from "./data.js";
import mongoose from "mongoose";
import config from "../config.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import paypalRouter from "./routers/paypalRouter.js";
const __dirname = import.meta.dirname;
import * as path from "path";

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// "the path that you provide to the express.static function is relative to the directory from where you launch your node process" - express docs
app.use(express.static(path.join(__dirname, "dist")));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route("/").get((req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/paypal", paypalRouter);

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

// process errors passed by express async handler
app.use((err, req, res, next) => {
  const status = err.name && err.name === "ValidationError" ? 400 : 500;
  res.status(status).send({ message: err.message });
});

app.listen(5000, () => {
  console.log("serve at http://localhost:5000");
});
