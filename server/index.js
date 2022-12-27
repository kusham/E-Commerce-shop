const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const slugify = require('slugify');

const dbConnect = require("./config/dbConnect");
const authRoute = require("./routes/authRoutes");
const productRoute = require("./routes/productRoutes");
const blogRoute = require("./routes/blogRoutes");
const categoryRoute = require("./routes/categoryRoutes");


const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  dbConnect();
});

app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", categoryRoute);



app.use(notFound);
app.use(errorHandler);
