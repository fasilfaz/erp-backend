const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { bgCyan } = require("colors");
require("colors");
const connectDb = require("./config/config");
const userRouter = require("./routes/userRoutes");
const billsRouter = require("./routes/billsRoute");
//dotenv config
dotenv.config();
//db config
connectDb();
//rest object
const app = express();

//middlwares
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://erp-fe-mu.vercel.app", 
    "https://erp-fe-git-fasil-fasils-projects-11c0a246.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "HEAD", "OPTIONS", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", userRouter);
app.use("/api/bills", billsRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});
//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}.bgCyan.white`);
});