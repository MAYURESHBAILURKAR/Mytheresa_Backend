const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  uniq_id: { type: String },
  crawl_timestamp: { type: String },
  product_id: { type: Number },
  link: { type: String },
  size: { type: String, required: true },
  variant_sku: { type: String, required: true },
  brand: { type: String },
  care_instructions: { type: String },
  dominant_material: { type: String },
  title: { type: String, required: true },
  actual_color: { type: String },
  dominant_color: { type: String },
  product_type: { type: String },
  images: { type: String },
  body: { type: String },
  product_details: { type: String },
  size_fit: { type: String },
  complete_the_look: { type: String },
  type: { type: String },
  variant_price: { type: Number, required: true },
  variant_compare_at_price: { type: Number, required: true },
  ideal_for: { type: String },
  is_in_stock: { type: String },
  inventory: { type: String },
  specifications: { type: String },
});

const ProductModel = model("product", productSchema);

module.exports = ProductModel;
