const mongoose = require("mongoose");

const { Schema } = mongoose;


// this is the model where created the schema to store the model 
// with symbol(company symbol) 
// with identifer (Place)
// daily in array with date, open and close.
const Substock = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  identifer: {
    type: String,
    required: true,
  },
  daily: [
    {
      date: String,
      open: {
        type: Number,
        index: "2d",
      },
      close: {
        type: Number,
        index: "2d",
      },
    },
  ],
});

module.exports = mongoose.model("Substock", Substock);
