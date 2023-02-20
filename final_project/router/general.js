const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let matchAuthor = [];
  for (const key in books) {
    let value = books[key];
    let author = req.params.author;

    if (value["author"] === author) {
      matchAuthor.push(value);
    }
  }
  return res.status(200).send(matchAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  for (const key in books) {
    let value = books[key];
    let title = req.params.title;
    if (value["title"] === title) {
      return res.status(200).send(value);
    }
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.status(200).send(books[isbn]["reviews"]);
});

// Async - Await

// Get the book list available in the shop
public_users.get("/asyncgetBook", async (req, res) => {
  try {
    const response = await axios.get(
      "https://u211111610-5000.theia-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/"
    );
    const books = response.data;
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching books");
  }
});

// Get book details based on ISBN
public_users.get("/asyncIsbn/:isbn", async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  try {
    const response = await axios.get(
      `https://u211111610-5000.theia-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`
    );
    const books = response.data;
    return res.status(200).send(books);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching Books ISBN");
  }
});

// Get book details based on author
public_users.get("/asyncAuthor/:author", async function (req, res) {
  //Write your code here
  let author = req.params.author;
  try {
    const response = await axios.get(
      `https://u211111610-5000.theia-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`
    );
    const books = response.data;
    return res.status(200).send(books);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching Books Author");
  }
});

// Get all books based on title
public_users.get("/asyncTitle/:title", async function (req, res) {
  //Write your code here
  let title = req.params.title;
  try {
    const response = await axios.get(
      `https://u211111610-5000.theia-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`
    );
    const books = response.data;
    return res.status(200).send(books);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching Books Title");
  }
});
module.exports.general = public_users;
