const express = require('express');
const axios = require('axios'); // We use this if we need to talk to other websites (but here it's optional).
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/* 
Task 10: Get the list of books available in the shop using async/await.
We pretend to wait for our book list to be ready (like waiting for cookies to bake).
*/
public_users.get('/', async function (req, res) {
  try {
    // Here we simulate waiting (asynchronously) for our books data.
    const result = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book list" });
  }
});

/* 
Task 11: Get book details based on ISBN using async/await.
We wait for our book with a given number (ISBN) to be ready.
*/
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn; // Get the book number from the URL.
    const result = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]); // If the book exists, give it to us.
      } else {
        reject("Book not found"); // Otherwise, say it's missing.
      }
    });
    return res.json(result);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});

/* 
Task 12: Get book details based on Author using async/await.
We wait for all books to be checked and find the ones by the right author.
*/
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const keys = Object.keys(books); // Get all our book numbers.
    let matchingBooks = {};
    // We check every book one by one, like looking through a picture book.
    await Promise.all(keys.map(key => {
      return new Promise((resolve, reject) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks[key] = books[key];
        }
        resolve();
      });
    }));
    if (Object.keys(matchingBooks).length > 0) {
      return res.json(matchingBooks);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

/* 
Task 13: Get book details based on Title using async/await.
We wait and look for the book with the right title.
*/
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const keys = Object.keys(books);
    let matchingTitles = {};
    // Check every book to see if its title matches, like matching puzzle pieces.
    await Promise.all(keys.map(key => {
      return new Promise((resolve, reject) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          matchingTitles[key] = books[key];
        }
        resolve();
      });
    }));
    if (Object.keys(matchingTitles).length > 0) {
      return res.json(matchingTitles);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Get book review (this one stays the same as before).
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Register route (same as before).
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
