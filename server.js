require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
// var port = process.env.PORT || 50451;
var port = 50451;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log(req.query);
  res.status(200).render("pages/index", {
    token: req.query.token
  });
});

app.listen(port, function() {
  console.log("listening on *:" + port);
});

app.use("/api/discord", require("./api/discord"));

app.use((err, req, res, next) => {
  switch (err.message) {
    case "NoCodeProvided":
      return res.status(400).send({
        status: "ERROR",
        error: err.message
      });
    default:
      return res.status(500).send({
        status: "ERROR",
        error: err.message
      });
  }
});
