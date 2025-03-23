// Bring in our helpers to build our app
const express = require('express'); // Express helps us make a web server.
const jwt = require('jsonwebtoken'); // JWT helps us check secret codes (tokens) for our users.
const session = require('express-session'); // This keeps track of users when they visit.
const customer_routes = require('./router/auth_users.js').authenticated; // Routes for logged-in customers.
const genl_routes = require('./router/general.js').general; // Routes for everyone.

// Create our web server app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use a secret session for routes under "/customer"
// The session acts like a backpack to remember who the user is.
app.use("/customer", session({
  secret: "fingerprint_customer", // Secret used to sign the session ID cookie
  resave: true, 
  saveUninitialized: true
}));

// For any request to "/customer/auth/*", check if the user has a valid token.
app.use("/customer/auth/*", (req, res, next) => {
    // Check if the session contains an authorization token.
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        // Verify the token using our secret word "access"
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Save user info for later use
                next(); // Proceed to the next middleware/route
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Mount customer routes (for authenticated users)
app.use("/customer", customer_routes);

// Mount general routes (accessible to everyone)
app.use("/", genl_routes);

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on port " + PORT));
