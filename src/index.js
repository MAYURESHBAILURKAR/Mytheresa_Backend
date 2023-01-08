const express = require("express");
const cors = require("cors");
const userRoute = require("./features/users/user.routes");
const productRoute = require("./features/products/product.routes");
const cartRoute = require("./features/cart/cart.routes");
const stripeRoute = require("./features/stripe/stripe.routes");
const connection = require("./config/connection");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/checkout", stripeRoute);

// app.get(`/`, (req, res) => res.send(`hello`));

app.listen(process.env.port, async () => {
  try {
    await connection();
    console.log(`Server Started at http://localhost:${process.env.port}`);
    console.log("Connected to DB Successfully");
  } catch (error) {
    console.log("Connection to DB failed");
    console.log(error);
  }
});
