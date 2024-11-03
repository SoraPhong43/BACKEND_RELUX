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
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://10.0.2.2:8080",
      "http://127.0.0.1:8080",
    ],
    credentials: true,
  })
);
//them middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//config template engine
configViewEngine(app);
//khai bao route
app.use("/api/v1", webRoute);
//ham tao bang
(async () => {
  try {
    await createTables();
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
})();
//static f
app.use("/images/avatar", express.static(path.join(__dirname, "uploads")));

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
