const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Endpoint for checking the book's publisher (your original functionality)
app.post('/findPublisher', (req, res) => {
    const bookTitle = req.body.title;
    let response = { publisher: "Unknown", message: "" };

    if (bookTitle === "Example Book Title") {
        response.publisher = "St. Martin's Press";
        response.message = "This publisher is an affiliate of St. Martin's Press, which is reported to support genocide. Consider boycotting.";
    }

    res.json(response);
});

// New endpoint for fetching book publisher by ISBN
app.get('/getPublisherByISBN', async (req, res) => {
    const { isbn } = req.query;

    if (!isbn) {
        return res.status(400).send('ISBN is required');
    }

    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const bookData = data[`ISBN:${isbn}`];

        if (bookData) {
            const publisher = bookData.publishers ? bookData.publishers[0].name : 'Publisher information not available';
            res.json({ publisher });
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
