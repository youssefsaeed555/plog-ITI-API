//create express app
const express = require("express");
// npm run start:dev
const app = express();
const path = require("path");
const cors = require("cors");
const compression = require("compression");
//config environment
require("dotenv").config();

//connect mongodb
require("./config/db")();

app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(compression());
app.use(express.static(path.join(__dirname, "uploads")));

//requires
const globalErrorHandling = require("./middleware/error_middleware");
const ApiError = require("./utils/ApiError");

//mount routing
require("./routes")(app);

app.all("*", (req, res, next) =>
  //Create an error and send it to error handling middleware
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400))
);

//global error handling for express
app.use(globalErrorHandling);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app running success`);
});

//handling exception out express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("server closed ...");
    process.exit(1);
  });
});
