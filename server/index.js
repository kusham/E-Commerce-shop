const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const authRoute = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require("./middleware/errorHandler");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  dbConnect();
});

app.use("/api/user", authRoute);
app.use(notFound);
app.use(errorHandler);

