const express = require("express");
const {
  SignUp,
  loginUser,
  authCheck,
  resetPassword,
} = require("./user.controller");

const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
  const { name, email, password, phone, role, gender } = req.body;
  //   console.log(name, email, password, phone, role, gender);
  const { message, desc } = await SignUp({
    name,
    email,
    password,
    phone,
    role,
    gender,
  });
  if (message != "OK") {
    return res.status(401).send(desc);
  } else {
    return res.status(201).send(desc);
  }
  // res.send("user");
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email,password);
  const { message, desc, token, refreshToken, userDetails } = await loginUser({
    email,
    password,
  });
  // console.log(message, desc, token, refreshToken, userDetails);

  if (message != "OK") {
    return res.status(401).send({ message: desc });
  } else {
    return res
      .status(201)
      .send({ message: desc, token, refreshToken, userDetails });
  }
});

userRoute.get("/isauth", async (req, res) => {
  const token = req.headers.token;
  // console.log(token);
  const { isAuth, message, desc, userDetails } = await authCheck({ token });

  if (message != "OK") {
    return res.status(401).send({ desc, isAuth, message });
  } else {
    return res.status(201).send({ desc, isAuth, userDetails });
  }
});

userRoute.put("/resetpassword", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  const { message, desc, updatedUser } = await resetPassword({
    email,
    password,
  });
  // console.log(message, desc, updatedUser);

  if (message != "OK") {
    return res.status(401).send({ message: desc });
  } else {
    return res.status(201).send({ message: desc, updatedUser });
  }
});

module.exports = userRoute;
