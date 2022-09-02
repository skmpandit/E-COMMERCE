const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary")
const connectDatabase = require("./config/database");

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down server due to uncaught Exceptions`);
    process.exit(1);
})

// Load env variables from .env file
dotenv.config({ path: "backend/config/config.env"});

// connecting to data database
connectDatabase();

// cloudinay for store data 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: http://localhost:${process.env.PORT}`);
})

// UnHandle Promise Rejection

process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    })
})