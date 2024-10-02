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


app.js

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
