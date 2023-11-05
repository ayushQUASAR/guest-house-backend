const express = require('express');
const router = express.Router();
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'your secret key',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user, isAdmin: req.session.isAdmin });
    console.log("loggedIn is true");
  } else {
    res.send({ loggedIn: false });
    console.log("loggedIn is false");
  }
});

module.exports = router;