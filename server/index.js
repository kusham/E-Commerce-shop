const express = require("express");
const dotenv = require("dotenv");
const dbConnect  = require("./config/dbConnect");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    dbConnect(); 
});
 