//  "/api/discord"

const express = require("express");
const fetch = require("node-fetch");
const btoa = require("btoa");
const { catchAsync } = require("../utils");

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent(
  "http://localhost:50451/api/discord/callback"
);


router.get("/login", (req, res) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=email%20identify`
  );
});

router.get("/logout", (req,res)=>{
  res.clearCookie("token")
  res.redirect(`/`);
});

router.get(
  "/callback",
  catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error("NoCodeProvided");
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await fetch(
      `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`
        }
      }
    );
    const json = await response.json();
    //console.log(json)
    res.cookie("token",json.access_token, {maxAge: 5 * 60 * 1000})
    res.redirect(`/`);
    
  })
);

module.exports = router;
