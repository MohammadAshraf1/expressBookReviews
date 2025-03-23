const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    // Extract username and password from the request body.
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if both username and password are provided.
    if (!username || !password) {
      // If either is missing, send a 400 Bad Request error.
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists.
    // 'users' is an array containing registered user objects.
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      // If the username already exists, send a 409 Conflict error.
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // If everything is fine, register the new user by adding to the users array.
    users.push({ username, password });
  
    // Return a success message.
    return res.status(200).json({ message: "User registered successfully" });
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
public_users.get('/author/:author', function (req, res) {
    // Get the 'author' parameter from the URL.
    // For example, if the URL is "/author/Jane Austen", then author = "Jane Austen".
    const author = req.params.author;

    // Get all the keys from the 'books' object.
    // These keys are the unique identifiers (like "1", "2", "3", etc.) for each book.
    const keys = Object.keys(books);

    // Create an empty object to store books that match the requested author.
    let matchingBooks = {};

    // Loop through each key in the 'books' object.
    keys.forEach(key => {
      // Check if the current book's author (converted to lower case for case-insensitive matching)
      // is equal to the requested author (also in lower case).
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        // If it matches, add this book to the 'matchingBooks' object using the same key.
        matchingBooks[key] = books[key];
      }
    });

    // After checking all books, if we found any matches (the matchingBooks object is not empty)...
    if (Object.keys(matchingBooks).length > 0) {
      // Return the matching books as a JSON response.
      return res.json(matchingBooks);
    } else {
      // If no matching books were found, return a 404 error with a message.
      return res.status(404).json({ message: "Book not found" });
    }
});

  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title parameter from the URL.
    const title = req.params.title;
  
    // Get all the keys from the 'books' object.
    const keys = Object.keys(books);
  
    // Create an empty object to store books that match the requested title.
    let matchingTitles = {};
  
    // Iterate over each key and check if the book's title matches the requested title.
    keys.forEach(key => {
      // Use a case-insensitive comparison for the title.
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingTitles[key] = books[key];
      }
    });
  
    // If matching books are found, return them as JSON.
    if (Object.keys(matchingTitles).length > 0) {
      return res.json(matchingTitles);
    } else {
      // If no matching books are found, return a 404 error with a message.
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN value from the URL parameters.
    // For example, if the request URL is "/review/1", then req.params.isbn will be "1".
    const isbn = req.params.isbn;
    
    // Use the ISBN value to look up the corresponding book in the "books" object.
    // The "books" object uses ISBN numbers (or keys) to store each book's data.
    const book = books[isbn];
    
    // Check if a book with the provided ISBN exists in the "books" object.
    if (book) {
        // If the book exists, respond with the book's reviews.
        // The book.reviews property is returned as JSON.
        return res.json(book.reviews);
    } else {
        // If no book is found with that ISBN, send a 404 (Not Found) error response.
        // The response includes a JSON object with an error message.
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
