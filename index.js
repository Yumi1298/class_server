const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport); // 執行passport套件
const cors = require("cors");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mernDB";

// 連結MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
// course route應該被jwt保護
// 如果request header內部沒有jwt,則request就會被視為unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// 只有登入系統的人，才能夠去新增課程或是註冊課程
// jwt

app.listen(8080, () => {
  console.log("後端伺服器聆聽在port 8080...");
});
