const express=require('express');
const app=express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

app.get("https://api.wazirx.com/api/v2/tickers", (req, res) => {
  const array = [];

});