const express = require("express");
const Stripe = require("stripe");

require("dotenv").config();

const stripeRoute = express.Router();

const stripe = Stripe(process.env.STRIPE_KEY);

stripeRoute.post("/create-checkout-session", async (req, res) => {
  //   const { cartItems, userId } = req.body;
  const line_items = req.body.cartItems.map((item) => {
    let image = item.productId.images.split("|")[0].trim();
    // console.log(image);

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productId.title,
          images: [image],
          description: item.productId.product_type,
          metadata: {
            id: item.productId._id,
          },
        },
        unit_amount: item.productId.variant_price * 100,
      },
      quantity: item.quantity,
    };
  });
  // console.log(line_items);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    shipping_options: [{ shipping_rate: "shr_1MNHjTSGvJ3WuRcD4f41Fmf5" }],
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({
    url: session.url,
  });
});

module.exports = stripeRoute;
