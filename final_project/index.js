// We bring in our tools to build our website!
const express = require('express');            // Express is like our magic box that makes websites.
const jwt = require('jsonwebtoken');             // JWT is a secret handshake to check if someone is allowed in.
const session = require('express-session');      // Sessions are like backpacks that remember who you are.
const customer_routes = require('./router/auth_users.js').authenticated; // This is the path for our logged-in (special) users.
const genl_routes = require('./router/general.js').general;               // This is the path for everyone (public pages).

// We create our website (our web server app).
const app = express();

// This line tells our website to understand a special language called JSON.
app.use(express.json());

// When someone goes to "/customer", we give them a special backpack (session) with a secret code.
app.use("/customer", session({
  secret: "fingerprint_customer", // Our secret password to protect the backpack.
  resave: true, 
  saveUninitialized: true
}));

// Before a user goes to any "secret" part ("/customer/auth/*"),
// we check if they have the secret handshake (a valid token) in their backpack.
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        // We check if the token is correct using our secret word "access".
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;  // We remember who they are.
                next();           // They can go on to see the page.
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Here we tell our website to use the special customer pages.
app.use("/customer", customer_routes);

// And here we tell our website to use the pages for everyone.
app.use("/", genl_routes);

// This is where our website listens for visitors (on door number 5000).
const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on port " + PORT));
