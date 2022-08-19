const mongoose = require("mongoose");


//const mongoDburl = "mongodb://localhost:27017/stockcollection?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const mongoDburl = "mongodb+srv://Anand:Kumar@cluster0.28kkaf4.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = async () => {
    mongoose.connect(mongoDburl, ()=> {
        console.log("connected to mongo Successfully");
    })
}

module.exports = connectToMongo;