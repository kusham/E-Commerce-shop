const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var oderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash on delivery",
        "Dispatched",
        "Canceled",
        "Delivered",
      ],
    },
    orderBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("User", oderSchema);
