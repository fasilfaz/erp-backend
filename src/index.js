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

//middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://erp-fe-mu.vercel.app",
    "https://erp-fe-mu.vercel.app/",  // Adding trailing slash version
    "http://erp-fe-mu.vercel.app",    // Adding HTTP version
    "http://erp-fe-mu.vercel.app/"    // Adding HTTP version with trailing slash
  ],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Add headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://erp-fe-mu.vercel.app');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

//routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", userRouter);
app.use("/api/bills", billsRouter);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`.bgCyan.white);
});