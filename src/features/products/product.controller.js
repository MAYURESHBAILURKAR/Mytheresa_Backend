const ProductModel = require("./product.model");
const { search } = require("./product.routes");

const getProducts = async ({
  price,
  ideal_for,
  sort,
  orderBy,
  brand,
  limit,
  page,
  dominant_color,
  search,
}) => {
  // console.log(
  //   `price:${price}, ideal_for:${ideal_for}, sort:${sort}, brand:${brand}, orderBy:${orderBy}, limit:${limit}, page:${page},dominant_color:${dominant_color},search:${search}`
  // );

  try {
    const query = {};
    if (search) {
      //  search=`${search}$`
      query.title = { $regex: search, $options: "i" };
      // query.title = new RegExp(search, 'i');
    }
    if (ideal_for) {
      query.ideal_for = ideal_for;
    }
    if (brand) {
      query.brand = brand;
    }
    if (dominant_color) {
      query.dominant_color = dominant_color;
    }
    if (price) {
      let [min, max] = price.split(",");
      query.price = { $gte: min, $lte: max };
    }
    if (!limit) {
      limit = 20;
    }
    if (!page) {
      page = 1;
    }
    // console.log(query);
    const products = await ProductModel.find(query)
      .sort({ [orderBy]: sort === "asc" ? 1 : sort === "desc" ? -1 : 0 })
      .limit(+limit)
      .skip((+page - 1) * limit);

    // console.log(products);
    return {
      message: "OK",
      Products: products,
    };
  } catch (error) {
    return {
      message: error.message,
    };
  }
};

const getProductByid = async ({ id }) => {
  try {
    const product = await ProductModel.findById(id);
    // console.log(product,id);
    if (!product) {
      return { message: "Product not found" };
    }
    return { message: "OK", Products: product };
  } catch (error) {
    return { message: error.message };
  }
};

const postproduct = async ({
  product_button_2,
  product_image_href,
  ph1,
  product_name,
  price,
  availability,
  availabe_size = "",
  availabe_size_2 = "",
  availabe_size_3 = "",
  availabe_size_4 = "",
  availabe_size_5 = "",
  availabe_size_6 = "",
  availabe_size_7 = "",
  availabe_size_8 = "",
  choose_size,
  availabe_sizes = "",
  availabe_sizes_2 = "",
  availabe_sizes_3 = "",
  availabe_sizes_4 = "",
  availabe_sizes_5 = "",
  availabe_sizes_6 = "",
  availabe_sizes_7 = "",
  availabe_sizes_8 = "",
  no_sizes,
  lazyload_src,
}) => {
  //   console.log();
  try {
    const product = new ProductModel({
      product_button_2,
      product_image_href,
      ph1,
      product_name,
      price,
      availability,
      availabe_size,
      availabe_size_2,
      availabe_size_3,
      availabe_size_4,
      availabe_size_5,
      availabe_size_6,
      availabe_size_7,
      availabe_size_8,
      choose_size,
      availabe_sizes,
      availabe_sizes_2,
      availabe_sizes_3,
      availabe_sizes_4,
      availabe_sizes_5,
      availabe_sizes_6,
      availabe_sizes_7,
      availabe_sizes_8,
      no_sizes,
      lazyload_src,
    });
    await product.save();
    return {
      message: "OK",
      desc: "Product Created",
    };
  } catch (error) {
    return {
      message: "ERROR",
      desc: error.message,
    };
  }
};

const deleteProduct = async ({ id }) => {
  // console.log(id);
  try {
    const product = await ProductModel.findByIdAndDelete(id);
    return {
      message: "OK",
      desc: `Product with ID: ${id} deleted successfully`,
    };
  } catch (error) {
    return {
      message: "ERROR",
      desc: error.message,
    };
  }
};

module.exports = { getProducts, getProductByid, postproduct, deleteProduct };
