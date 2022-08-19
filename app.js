/*

it will install all the important files
-> npm install 
for starting the server we are going to use the 
-> npm run nodemon 
i have given the url detail for that you can used on postman
this is json detail for the geting the stock from database;

*/ 
const express = require("express");
const connect = require("./databases/db");
const cors = require('cors');

connect();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// giving the route for API ;
app.use("/api/stockexchange", require("./routes/stockexchange"));

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});



