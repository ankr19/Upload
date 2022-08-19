const express = require("express");
const Substock = require("../model/Substock");
const router = express.Router();

// 1 router for the adding the stock with substock
// url for storing the data http://localhost:5000/api/stockexchange/poststock
/*
data that i have given is like this.
{
  "symbol": "APPL",
  "identifer": "US",
  "open": 41.0300,
  "close": 40.6900
}

it will store like 
"symbol":symbol,
"idenifier": idenifier,
daily: [{
  date: date,
  open: open,
  close: close,
}, ]

*/

router.post("/poststock", async (req, res) => {
  const { symbol, identifer, open, close } = req.body;
  // storing the today date in date-month-year format;
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "-" + dd + "-" + yyyy;
  // storing the data
  try {
    // in this if the stock is into the database or not
    const savestock = await Substock.findOne({ symbol: symbol }).exec();
    if (savestock) {
      // if the stock into the database then we just simply updating the data with date, open, closed value;
      const value = await Substock.findOneAndUpdate(
        { symbol: symbol },
        { $push: { daily: { date: today, open: open, close: close } } }
      );
      res.status(200).send(value);
    }
    // if the stock is not into the stock then we going to create that.
    else {
      const stock = new Substock({
        symbol,
        identifer,
        daily: [
          {
            date: today,
            open: open,
            close: close,
          },
        ],
      });
      // saving the data
      const savestock = await stock.save();
      res.json(savestock);
    }
  } catch (error) {
    // if there is error into server;
    console.log(error.message);
    res.status(500).send("internal Server erorr");
  }
});


// 2nd router for updating the value

// 2nd router for getting the value

/*
api : http://localhost:5000/api/stockexchange/stock
route: post
data is in json format like this
{
  "symbol": "APPL"
}

 */


router.post("/stock", async (req, res) => {
  const { symbol } = req.body;
  try {
    let value = await Substock.findOne({ symbol });
    res.status(200).send(value);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal Server erorr");
  }
});

module.exports = router;
