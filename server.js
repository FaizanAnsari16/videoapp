const express = require("express");
const app = express();
const Data = { peerID: "123-456" };
app.get("/user", (req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  res.status(200).json(Data);
});
app.post("/postdata", (req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  let a = req.body;
  console.log(req.body.keys);
  console.log(req.body);
});
app.listen(3000);
