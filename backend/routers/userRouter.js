import express from "express";
import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import { generateToken, isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.get(
  "/createadmin",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: "admin",
        email: "admin@example.com",
        password: "password",
        isAdmin: true,
      });
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }),
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!signinUser) {
      res.status(401).send({ error: "Sorry, invalid email or password." });
    } else {
      res.send({
        _id: signinUser._id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: generateToken(signinUser),
      });
    }
  }),
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const createdUser = await user.save();

      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    } catch (error) {
      let message = "";
      const errorHeading = error.message.split(":")[0];

      if (errorHeading.includes("validation")) {
        if (error.errors.name) {
          message += "Please enter a name.<br><br>";
        }
        if (error.errors.email) {
          message += "Please enter a valid email.<br><br>";
        }
        if (error.errors.password) {
          message += "Please enter a valid password.<br><br>";
        }
      }

      if (errorHeading.includes("duplicate")) {
        message += "A user with that email already exists.<br><br>";
        res.status(401).json({ error: message });
      }

      res.status(401).json({ error: message });
    }
  }),
);

userRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send({ error: "Sorry, could not find user." });
    } else {
      try {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;

        const updatedUser = await user.save();

        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        });
      } catch (error) {
        let message = "";
        const errorHeading = error.message.split(":")[0];

        if (errorHeading.includes("validation")) {
          if (error.errors.email) {
            message += "Please enter a valid email.<br><br>";
          }
          if (error.errors.password) {
            message += "Please enter a valid password.<br><br>";
          }
        }

        if (errorHeading.includes("duplicate")) {
          message += "A user with that email already exists.<br><br>";
        }

        res.status(401).json({ error: message });
      }
    }
  }),
);

export default userRouter;
