const express = require('express');           // Express helps us make our website.
const jwt = require('jsonwebtoken');            // JWT is our secret handshake tool.
let books = require("./booksdb.js");            // This is our list of books.
const regd_users = express.Router();            // We make a mini-website for our registered users.

let users = [];                                 // This will hold our registered users.

// isValid checks if a username is not already used (like checking if a toy is already taken).
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// authenticatedUser checks if the username and password match an existing user.
const authenticatedUser = (username, password) => {
  let validUser = users.filter(user => {
    return (user.username === username && user.password === password);
  });
  return validUser.length > 0;
};

// ---------- Task 7: Login ----------
// Only our special (registered) users can log in.
regd_users.post("/login", (req, res) => {
  const username = req.body.username;  // Get the name from what the user tells us.
  const password = req.body.password;  // Get the secret code (password).

  // If they forget to give a name or a secret code, we say "Please give both."
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // We check if the name and secret code are right.
  if (authenticatedUser(username, password)) {
    // We make a secret handshake (token) that says "I know who you are" and it lasts 1 hour.
    let token = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });
    
    // We put this secret handshake in their backpack (session).
    req.session.authorization = { accessToken: token, username: username };
    
    return res.status(200).json({ message: "Customer successfully logged in", token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// ---------- Task 8: Add or Modify a Book Review ----------
// Only our logged-in users can add or change a review.
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;        // Get the book number from the URL.
  const review = req.query.review;       // Get the review text from the URL (like "This book is fun!").
  const username = req.session.authorization.username;  // Get the name from their backpack.

  // Check if the book exists. If not, we say "Book not found".
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or change the review for this user.
  books[isbn].reviews[username] = review;
  
  return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

// ---------- Task 9: Delete a Book Review ----------
// Only our logged-in users can delete their own review.
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;  // Get the book number from the URL.
  const username = req.session.authorization.username;  // Get the name from their backpack.

  // If the book doesn't exist, we say "Book not found".
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // If there's no review from this user, we say "Review not found for this user".
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Remove the review that belongs to this user.
  delete books[isbn].reviews[username];
  
  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
