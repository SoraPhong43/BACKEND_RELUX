require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const configViewEngine = require("./config/viewEngine");
const connection = require("./config/database");
const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME;
const webRoute = require("./routes/api");
const createTables = require("./mirgration/createTables");

//them middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//config template engine
configViewEngine(app);
//khai bao route
app.use("/api/v1", webRoute);
//ham tao bang
createTables();
//test connection

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
