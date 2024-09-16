// Import dotenv and load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import other modules
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';
import path from 'path';
import { __dirname } from './utils.js'; // Import the utility
import methodOverride from 'method-override';   // To process POST calls and route them to PUT or DELETE routes if necesary.

// Initialize Express app
const app = express();
const port = 3000;

// Set DB connection configuration
const pool =  new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CERT,
    },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());                                 // For parsing application/json
app.use(express.static(path.join(__dirname, 'public')));    // Set the path to the public folder for javascript files, images and other static content.
app.use(methodOverride('_method'));                         // Middleware to parse some POST calls from the FrontEnd that needs to be re-routed to a PUT or DELETE routes.

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// GET all books with their reviews
app.get('/', async (req, res) => {
    const sort = req.query.sort || 'title';

    let sortQuery = 'ORDER BY title ASC';
    if (sort === 'rating') {
        sortQuery = 'ORDER BY rating DESC';
    } else if (sort === 'recency') {
        sortQuery = 'ORDER BY created_at DESC'; // Assuming you have a created_at column
    }

    try {
        const booksResult = await pool.query(`
            SELECT books.id, books.title, books.author, books.cover_url, reviews.rating, books.deletable 
            FROM books
            LEFT JOIN reviews ON books.id = reviews.book_id
            ${sortQuery}
        `);
        const books = booksResult.rows;

        res.render('index', { books, sort, currentPage: 'home' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Render the form to add a new book
app.get('/books/new', (req, res) => {
    res.render('addBook'); // Render addBook.ejs view
});

app.get('/books/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const bookResult = await pool.query(`
            SELECT * FROM books WHERE id = $1
        `, [bookId]);

        if (bookResult.rows.length === 0) {
            return res.status(404).send('Book not found');
        }

        const book = bookResult.rows[0];

        const reviewsResult = await pool.query(`
            SELECT * FROM reviews WHERE book_id = $1
        `, [bookId]);

        const reviews = reviewsResult.rows;

        res.render('book', { book, reviews, currentPage: 'book' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// GET for Edit a book review
app.get('/books/:id/edit', async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
        const bookResult = await pool.query(`
            SELECT * FROM books WHERE id = $1
        `, [bookId]);

        if (bookResult.rows.length === 0) {
            return res.status(404).send('Book not found');
        }

        const book = bookResult.rows[0];

        const reviewsResult = await pool.query(`
            SELECT * FROM reviews WHERE book_id = $1
        `, [bookId]);

        const reviews = reviewsResult.rows;

        res.render('editBook', { book, review: reviews[0], currentPage: 'editBook' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// POST endpoint to add a new book with a review
app.post('/books', async (req, res) => {
    const { title, author, isbn, review_text, rating } = req.body;

    // Ensure rating is a valid integer and set to default if not
    const ratingValue = parseInt(rating, 10);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).send('Invalid rating value');
    }

    // Construct cover URL using the ISBN
    const cover_url = `https://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Insert the new book
        const result = await client.query(
            'INSERT INTO books (title, author, cover_url) VALUES ($1, $2, $3) RETURNING id',
            [title, author, cover_url]
        );
        const bookId = result.rows[0].id;

        // Insert the review for the new book
        await client.query(
            'INSERT INTO reviews (book_id, review_text, rating) VALUES ($1, $2, $3)',
            [bookId, review_text, rating]
        );

        await client.query('COMMIT'); // Commit transaction

        res.redirect('/');
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error(err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

// PUT endpoint to update a book and its review
app.put('/books/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, cover_url, review_text, rating } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        // Update the book
        await client.query(
            'UPDATE books SET title = $1, author = $2, cover_url = $3 WHERE id = $4',
            [title, author, cover_url, bookId]
        );

        // Update the review
        await client.query(
            'UPDATE reviews SET review_text = $1, rating = $2 WHERE book_id = $3',
            [review_text, rating, bookId]
        );

        await client.query('COMMIT'); // Commit transaction

        res.redirect(`/books/${bookId}`);
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error(err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

// DELETE endpoint to delete a book
app.delete('/books/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);

    try {
        await pool.query(
            'DELETE FROM reviews WHERE book_id = $1',
            [bookId]
        );
        await pool.query(
            'DELETE FROM books WHERE id = $1',
            [bookId]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
