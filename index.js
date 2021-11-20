const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const rewardRoute = require("./routes/rewardRoute");

//create an app
const app = express();

//middleware
// it will serve config.env file
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_ENCODED_PASSWORD
);

//connect mongodb to app
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB CONNECTION SUCCESFULLY");
  });

app.use(express.json());

//middleware
app.use("/api/rewardApp", rewardRoute);

//server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});
