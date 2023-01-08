const express = require("express");
const {
  getProducts,
  getProductByid,
  postproduct,
  deleteProduct,
} = require("./product.controller");

const productRoute = express.Router();

productRoute.get("/", async (req, res) => {
  const {
    price,
    ideal_for,
    sort,
    brand,
    orderBy,
    limit,
    page,
    dominant_color,
    search
  } = req.query;
  // console.log(
  //   `price:${price}, ideal_for:${ideal_for}, sort:${sort}, brand:${brand}, orderBy:${orderBy}, limit:${limit}, page:${page},dominant_color:${dominant_color},search:${search}`
  // );
  try {
    const { Products, message } = await getProducts({
      price,
      ideal_for,
      sort,
      orderBy,
      limit,
      page,
      brand,
      dominant_color,
      search
    });
    if (message != "OK") {
      return res.status(404).send({ message: message });
    } else {
      return res.status(200).send({ message: message, Products });
    }
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

productRoute.get("/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const { Products, message } = await getProductByid({ id });
    if (message != "OK") {
      return res.status(404).send({ message: message });
    } else {
      return res.status(200).send({ message: message, Products });
    }
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

productRoute.post("/", async (req, res) => {
  const details = req.body;
  // console.log(details);

  try {
    const { message, desc } = await postproduct(details);
    if (message != "OK") {
      return res
        .status(404)
        .send({ message: "Product failed to create", error: desc });
    } else {
      return res.status(201).send(desc);
    }
  } catch (error) {
    return res.send(error.message);
  }
});

productRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { message, desc } = await deleteProduct({ id });
    if (message != "OK") {
      return res.status(404).send(desc);
    } else {
      return res.status(200).send(desc);
    }
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = productRoute;
