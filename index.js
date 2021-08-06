const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

// connecting database

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.aku3b.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const option = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(uri, option)
  .then(() => console.log("Base de datos conectada"))
  .catch((e) => console.log("error db:", e));

// import routes
const routes = require("./routes/routes");

// route middlewares
app.use("/api/user", routes);
app.get("/", (req, res) => {
  res.json({
    state: true,
    message: "funciona!",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`servidor andando en: ${PORT}`);
});
