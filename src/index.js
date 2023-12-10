const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const db = require("./db/db");
const products = JSON.parse(fs.readFileSync("src/db/products.json", "utf8"));

//Config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//Router File
const routes = require("./routes/routes");
app.use("/api", routes);

//ejs base render
app.get("/", (req, res) => {
  const user_id = "admin@test.com";
  const cart = db.cart;
  res.render("index", { products, user_id, cart });
});

//Health check
app.get("/health", (req, res) => {
  res.send("Server is Healthy");
});

//404 catch
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route Not Found!" });
});

//Error Handler
app.use((error, req, res, next) => {
  console.error("Error-> " + error);
  res
    .status(error.status || 500)
    .json({ message: error.message || "Internal Server Error!!" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
