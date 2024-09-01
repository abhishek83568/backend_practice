const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
   
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,ref:'user',
        required:true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
