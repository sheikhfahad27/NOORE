const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  product: {
    type: String,
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },

  size: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
