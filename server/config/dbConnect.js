const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log(error.message));
};

module.exports = dbConnect;
