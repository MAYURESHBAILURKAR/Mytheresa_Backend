const CartModel = require("./cart.model");

const getCartItems = async ({ userId }) => {
  try {
    const cart = await CartModel.find({ userId })
      .populate("productId")
      .select("-userId");
    // console.log(userId, cart);
    return {
      message: "OK",
      cart,
    };
  } catch (error) {
    return {
      message: "ERROR",
      desc: error.message,
    };
  }
};

const postCartItem = async ({ productId, userId, quantity }) => {
  // console.log(productId, userId, quantity);
  try {
    const isProductExits = await CartModel.findOne({ productId, userId });
    if (isProductExits) {
      return {
        message: "EXISTS",
        desc: "Product already exists in cart",
      };
    }

    const cart = await CartModel.create({ productId, userId, quantity });

    const newCartItem = await CartModel.findById(cart._id)
      .populate("productId")
      .select("-userId");
    return {
      message: "OK",
      desc: "Product Added Successfully in cart",
      newCartItem,
    };
  } catch (error) {
    return {
      message: "ERROR",
      desc: "Product not added to cart",
    };
  }
};

const updateCartItem = async ({ userId, id, quantity }) => {
  // console.log( userId, id, quantity );
  try {
    const cartItem = await CartModel.findById(id);
    // console.log( cartItem );

    if (cartItem && cartItem.userId.toString() === userId) {
      const cart = await CartModel.findByIdAndUpdate(
        id,
        { userId, productId: cartItem.productId, quantity },
        { new: true }
      )
        .populate("productId")
        .select("-userId");
      return {
        message: "OK",
        desc: "Cart updated successfully",
        updateditem: cart,
      };
    } else {
      return {
        message: "ERROR",
        desc: "Item does not exist in cart",
      };
    }
  } catch (error) {
    return {
      message: "ERROR",
      desc: error,
    };
  }
};

const deleteCartItem = async ({ userId, id }) => {
  // console.log(userId, id);
  try {
    const cartItem = await CartModel.findById(id);
    if (cartItem && cartItem.userId.toString() === userId) {
      const cart = await CartModel.findByIdAndDelete(id)
        .populate("productId")
        .select("-userId");
      return {
        message: "OK",
        desc: "Product deleted from the cart",
        deletedItem: cart,
      };
    } else {
      return {
        message: "ERROR",
        desc: "Item does not exist in cart",
      };
    }
  } catch (error) {
    return {
      message: "ERROR",
      desc: error,
    };
  }
};

const emptyCart = async ({ userId }) => {
  // console.log(userId);
  
  try {
    const cartItem = await CartModel.deleteMany({ userId });
    // console.log(cartItem);
    return {
      message: "OK",
      desc: "CART SUCCESSFULLY EMPTIED",
    };
  } catch (error) {
    return {
      message: "ERROR",
      desc: error,
    };
  }
};

module.exports = {
  getCartItems,
  postCartItem,
  updateCartItem,
  deleteCartItem,
  emptyCart,
};
