const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getCartItems,
  postCartItem,
  updateCartItem,
  deleteCartItem,
  emptyCart,
} = require("./cart.controller");

const cartRoute = express.Router();

cartRoute.use(authMiddleware);

cartRoute.get("/", async (req, res) => {
  const userId = req.userId;
  // console.log(userId);
  try {
    const { message, cart, desc } = await getCartItems({ userId });
    if (message != "OK") {
      return res.status(404).send({ message: desc });
    } else {
      return res.status(200).send({ message: message, cartItems: cart });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
  // console.log(userId);
});

cartRoute.post("/", async (req, res) => {
  const userId = req.userId;
  try {
    const { productId, quantity } = req.body;
    const { message, desc, newCartItem } = await postCartItem({
      productId,
      quantity,
      userId,
    });
    if (message == "ERROR") {
      return res.status(404).send({ message: desc });
    } else if (message == "EXISTS") {
      return res.status(404).send({ message: desc });
    } else if (message == "OK") {
      return res.status(201).send({ message: desc, newCartItem });
    }
  } catch (error) {
    return res.status(404).send({ message: "Something went wrong" });
  }
});

cartRoute.put("/:id", async (req, res) => {
  const userId = req.userId;
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const { message, desc, updateditem } = await updateCartItem({
      userId,
      id,
      quantity,
    });
    if (message != "OK") {
      res.status(404).send(desc);
    } else {
      res.status(200).send({ desc, updateditem });
    }
  } catch (error) {
    res.status(404).send({ message: error });
  }
});

cartRoute.delete("/:id", async (req, res) => {
  const userId = req.userId;
  try {
    const { id } = req.params;
    const { message, desc, deletedItem } = await deleteCartItem({ userId, id });
    if (message != "OK") {
      res.status(404).send(desc);
    } else {
      res.status(200).send({ desc, deletedItem });
    }
  } catch (error) {
    res.status(404).send({ message: error });
  }
});

cartRoute.get("/emptycart", async (req, res) => {
  const userId = req.userId;
  // console.log(userId);

  try {
    const { message, desc } = await emptyCart({ userId });
    if (message != "OK") {
      res.status(404).send({ desc });
    } else {
      res.status(200).send({ desc });
    }
  } catch (error) {
    res.status(404).send({ message: error });
  }
});

module.exports = cartRoute;
