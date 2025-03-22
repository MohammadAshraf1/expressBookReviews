const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
// When you visit the URL: http://localhost:5000/isbn/1

public_users.get('/isbn/:isbn', function (req, res) {
    // --- Step 1: Extracting the ISBN ---
    // Express sees the route parameter :isbn and creates an object:
    // req.params = { isbn: "1" }
    const isbn = req.params.isbn;  // isbn is now "1"
    
    // --- Step 2: Looking Up the Book ---
    // The books object is defined as:
    // let books = {
    //   1: { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {} },
    //   2: { ... },
    //   ...
    // }
    // In JavaScript, even if you define keys as numbers, they are treated as strings.
    // So, books[isbn] is the same as books["1"]
    const book = books[isbn]; // This finds the book with key "1"
  
    // --- Step 3: Sending the Response ---
    if (book) {
      // If a book is found, return it as a JSON response.
      return res.json(book);
    } else {
      // If no book is found with that ISBN, send a 404 error.
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(300).json({message: "Yet to be implemented"});
});
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
