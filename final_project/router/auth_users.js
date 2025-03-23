const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Checks if a username is valid (i.e. not already taken)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// Authenticates a user by checking if username and password match an existing user
const authenticatedUser = (username, password) => {
  let validUser = users.filter(user => {
    return (user.username === username && user.password === password);
  });
  return validUser.length > 0;
};

// ===================== Task 7: Login =====================
// Only registered users can log in
regd_users.post("/login", (req, res) => {
  // Extract username and password from the request body
  const username = req.body.username;
  const password = req.body.password;
  
  // Validate that both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Sign a JWT token with the username as payload (secret: "access")
    let token = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 }); // token expires in 1 hour
    
    // Save the token and username in the session under authorization
    req.session.authorization = { accessToken: token, username: username };
    
    return res.status(200).json({ message: "Customer successfully logged in", token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// ===================== Task 8: Add or Modify a Book Review =====================
// Only authenticated (logged-in) users can add/modify a review.
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the URL parameters
  const isbn = req.params.isbn;
  // Get the review text from the query parameter (e.g., ?review=YourReviewHere)
  const review = req.query.review;
  // Get the username from the session stored during login
  const username = req.session.authorization.username;
  
  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Add or modify the review for this user.
  // If the same user posts another review for the same ISBN, it will update the review.
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

// ===================== Task 9: Delete a Book Review =====================
// Only authenticated users can delete their own review.
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the URL parameters
  const isbn = req.params.isbn;
  // Get the username from the session
  const username = req.session.authorization.username;
  
  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Check if there is a review by this user
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }
  
  // Delete the review associated with the current user
  delete books[isbn].reviews[username];
  
  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
