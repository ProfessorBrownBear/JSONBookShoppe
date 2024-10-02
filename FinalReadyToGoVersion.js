Here's the complete code for the API server portion of the lab, ready to copy and paste into Visual Studio Code. This code sets up an Express server with MongoDB connection and includes all the routes for the bookstore API.
Bookstore API ServerClick to open code
To use this code:

Create a new file named server.js in your project directory.
Copy and paste the entire code block into this file.
Make sure you have the required dependencies installed. Run the following command in your terminal:
npm install express mongoose body-parser

Ensure you have MongoDB installed and running on your local machine.
Run the server with the command:
node server.js

This server will start on port 3000 (or the port specified in your environment variables) and connect to a local MongoDB database named 'bookstore'.
The server provides the following API endpoints:

POST /api/authors - Create a new author
GET /api/authors - Get all authors
POST /api/books - Create a new book
GET /api/books - Get all books (with author details populated)
GET /api/books/:id - Get a specific book by ID
PATCH /api/books/:id - Update a book
DELETE /api/books/:id - Delete a book

///
"Highlights Reel" that showcases how Mongoose and Express work together to perform CRUD operations on JSON documents. This will focus on the key aspects of each operation.
Mongoose and Express CRUD Operations HighlightsClick to open document
See complete Code Details Here: 
https://coda.io/@peter-sigurdson/mongo-json-cruc


This Highlights Reel showcases:

How Mongoose schemas define the structure of JSON documents.
The connection between Express routes and Mongoose operations.
The use of Mongoose methods for each CRUD operation.
How to handle relationships between documents using populate().
The importance of error handling in each operation.
The use of async/await for cleaner asynchronous code.

Key takeaways for students:

CREATE: Use new Model(data) to create a document, then save() to insert it.
READ: Use find() for multiple documents, findById() for a single document.
UPDATE: First findById(), then modify the document, and save() again.
DELETE: findById() to ensure the document exists, then remove() it.
Populate: Use .populate() to replace references with full documents.
Always handle potential errors and send appropriate HTTP status codes.

This reel provides a concise overview of how Mongoose and Express work together to handle JSON documents in a MongoDB database, demonstrating each CRUD operation in the context of a RESTful API.

///


Students can now use this server in conjunction with the HTML frontend we created earlier to interact with the API and see the results immediately. 
  This setup provides a quick reward cycle, allowing students to see a working version before diving into the code details.


// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost/bookstore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define schemas
const authorSchema = new mongoose.Schema({
  name: String,
  bio: String
});

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  publishedYear: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
});

// Create models
const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);

// Routes

// Author routes
app.post('/api/authors', async (req, res) => {
  const author = new Author(req.body);
  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/authors', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book routes
app.post('/api/books', async (req, res) => {
  const book = new Book(req.body);
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    Object.assign(book, req.body);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  
