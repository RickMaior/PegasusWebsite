require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
var port = process.env.PORT || 50451;

const fetch = require("node-fetch");

app.set("view engine", "ejs");

app.use(express.static("public"));

const authMiddleware = async (req, res, next) => {
  if (req.query.token) {
    const user = await fetch(`https://discordapp.com/api/users/@me`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + req.query.token
      }
    }).then(res => res.json());

    res.locals.user = {
      ...user,
      avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    };
  } else {
    res.locals.user = null;
  }

  next();
};

app.use(authMiddleware);

app.get("/", async (req, res) => {

  console.log(res.locals.user);

  res.status(200).render("pages/index", {
    imageUrl: res.locals.user.avatarUrl,
    user: res.locals.user
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
