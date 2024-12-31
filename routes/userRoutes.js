const express = require("express");
const {
  loginController,
  registerController,
} = require("./../controllers/userController");

const userRouter = express.Router();

//routes
//Method - get
userRouter.post("/login", loginController);

//MEthod - POST
userRouter.post("/register", registerController);

module.exports = userRouter;
