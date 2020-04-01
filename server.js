require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
// var port = process.env.PORT || 50451;
var port = 50451;
const fetch = require("node-fetch");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", async (req, res) => {
  let token = req.query.token;
  let imageUrl;
  console.log(token);
  let user;
  if (token) {
    const response = await fetch(`https://discordapp.com/api/users/@me `, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    });
    user = await response.json();
    imageUrl=`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    //console.log(user);
  }

  res.status(200).render("pages/index", {
    imageUrl: imageUrl,
    user: user
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
