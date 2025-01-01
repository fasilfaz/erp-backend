const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { bgCyan } = require("colors");
require("colors");
const connectDb = require("./config/config");
const userRouter = require("./routes/userRoutes");
//dotenv config
dotenv.config();
//db config
connectDb();
//rest object
const app = express();

//middlwares
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(
  {
    origin: "http://localhost:5173",
  }
));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", userRouter);
app.use("/api/bills", require("./routes/billsRoute"));

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`.bgCyan.white);
});
