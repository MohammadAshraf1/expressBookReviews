// Bring in our helpers to build our app
const express = require('express'); // Express helps us make a web server.
const jwt = require('jsonwebtoken'); // JWT helps us check secret codes (tokens) for our users.
const session = require('express-session'); // This keeps track of users when they visit.
const customer_routes = require('./router/auth_users.js').authenticated; // Routes for logged-in customers.
const genl_routes = require('./router/general.js').general; // Routes for everyone.

// Create our web server app
const app = express();

// Tell our app to understand messages in a special language called JSON.
app.use(express.json());

// Tell our app to use a secret session when a customer goes to "/customer"
// A session is like a backpack that remembers who you are.
app.use("/customer", session({
  secret: "fingerprint_customer", // This is a secret code to keep your session safe.
  resave: true, 
  saveUninitialized: true
}));

// For any request to "/customer/auth/*", check if the user has a secret token.
app.use("/customer/auth/*", function auth(req, res, next) {
    // Look in the session backpack for our secret token.
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Check if the token is correct using our secret word "access".
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Save the user info for later.
                next(); // Let the user continue to the page.
            } else {
                // If the token is wrong, say "No, you can't come here."
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        // If there's no token at all, say "No, you must log in first."
        return res.status(403).json({ message: "User not logged in" });
    }
});

// This is the door number where our app listens for visitors.
const PORT = 5000;

// Use the routes for customers and general visitors.
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server and say "Server is running" in our console.
app.listen(PORT, () => console.log("Server is running"));
