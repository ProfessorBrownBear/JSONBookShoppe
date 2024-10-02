bookroutes.js

const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();   

// https://www.perplexity.ai/page/npm-router-package-overview-hsWSi3WySCSNduB_QvvoAw

// https://www.npmjs.com/package/router

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



// GET all books

router.get('/books', async (req, res) => {

  try {

// JOIN between collections happens when you use the POPULATE METHOD:

    const books = await Book.find().populate('author');

// remember in express.js res → response back to the requesting web page.

    res.json(books);

  } catch (err) {

    res.status(500).json({ message: err.message });

  }

});



// GET a specific book by ID

router.get('/books/:id', async (req, res) => {

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



// POST a new author

router.post('/authors', async (req, res) => {

  const author = new Author({

    name: req.body.name,

    bio: req.body.bio

  });



  try {

    const newAuthor = await author.save();

    res.status(201).json(newAuthor);

  } catch (err) {

    res.status(400).json({ message: err.message });

  }
});

// POST a new book
router.post('/books', async (req, res) => {
  const book = new Book({

    title: req.body.title,

    description: req.body.description,

    publishedYear: req.body.publishedYear,

    author: req.body.authorId

  });

  try {

    const newBook = await book.save();

    res.status(201).json(newBook);

  } catch (err) {

    res.status(400).json({ message: err.message });

  }

});

// PATCH (update) a book

router.patch('/books/:id', async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {

      return res.status(404).json({ message: 'Book not found' });

    }



    if (req.body.title) book.title = req.body.title;

    if (req.body.description) book.description = req.body.description;

    if (req.body.publishedYear) book.publishedYear = req.body.publishedYear;

    if (req.body.authorId) book.author = req.body.authorId;



    const updatedBook = await book.save();

    res.json(updatedBook);

  } catch (err) {

    res.status(400).json({ message: err.message });

  }

});



// DELETE a book

router.delete('/books/:id', async (req, res) => {

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



module.exports = router;


************** app.js  *********************

  The API endpoints we created are just the backend. 
  They provide the data and handle the database operations, but don't directly create any user interface. 
  The frontend (HTML, CSS, JavaScript) is responsible for creating the user interface and interacting with these API endpoints.

The code I provided for the bookstore shop does not contain a webpage to actuate the APIs. What I shared is strictly the backend Express.js routes that define the API endpoints for interacting with the MongoDB database.
This code sets up RESTful API endpoints that can be called from any client (web, mobile, or other services), but it doesn't include any frontend code or HTML pages to interact with these APIs directly.
To create a webpage that interacts with these APIs, you would need to:

Create HTML pages for your bookstore interface.
Use JavaScript (potentially with a framework like React, Vue, or Angular) to make HTTP requests to these API endpoints.
Handle the responses from the API and update the webpage accordingly.

For example, a simple HTML page with JavaScript to fetch and display all books might look something like this:
Simple Bookstore FrontendClick to open website
This simple HTML page would:

Make a GET request to /api/books when loaded.
Receive the JSON response containing all books.
Create HTML elements to display each book's information.

To use this, you would need to:

Set up a way to serve static files in your Express app.
Create more HTML pages and JavaScript functions to handle creating, updating, and deleting books.

For a full-fledged web application, you might want to consider:

Using a frontend framework like React, Vue, or Angular for more complex interactions.
Implementing user authentication and authorization.
Adding form validation on both client and server sides.
Improving error handling and user feedback.
Styling your pages with CSS for a better user experience.
  
  
  
const bookRoutes = require('./bookRoutes');
app.use('/api', bookRoutes);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define schemas
const authorSchema = new mongoose.Schema({
  name: String,
  birthYear: Number
});

const bookSchema = new mongoose.Schema({
  title: String,
  publishYear: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
});

// Create models
const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);

// Routes

// GET all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new author
app.post('/api/authors', async (req, res) => {
  const author = new Author({
    name: req.body.name,
    birthYear: req.body.birthYear
  });

  try {
    const newAuthor = await author.save();
    res.status(201).json(newAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST a new book
app.post('/api/books', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    publishYear: req.body.publishYear,
    author: req.body.authorId
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update) a book
app.patch('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (req.body.title != null) {
      book.title = req.body.title;
    }
    if (req.body.publishYear != null) {
      book.publishYear = req.body.publishYear;
    }
    if (req.body.authorId != null) {
      book.author = req.body.authorId;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
