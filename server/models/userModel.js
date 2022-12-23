const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

const ObjectID = mongoose.ObjectId;
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Array,
    default: [],
  },
  address: [
    {
      type: ObjectID,
      ref: "Address",
    },
  ],
  wishList: [{ type: ObjectID, ref: "Product" }],
  refreshToken: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String, 
  passwordResetExpires: Date,
});

// hash password
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.method.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
