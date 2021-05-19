const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    sku: {
      require: true,
      type: String,
    },
    unitprice: {
      require: true,
      type: Number,
    },
    name: {
      required: true,
      type: String,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Product", productSchema);
