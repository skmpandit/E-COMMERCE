const mongoose = require("mongoose");


const connectDatabase = () =>  {
    mongoose.connect(process.env.MONGO_URI).then((con) => {
        console.log(`MongoDB is connected with server: ${con.connection.host}`);
    });
}

module.exports = connectDatabase;