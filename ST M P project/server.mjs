import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// List of publishers to check for affiliation with St. Martin's Press
const boycottedPublishers = [
    "Minotaur Books",
    "St Martin’s Essentials",
    "St. Martin's Griffin",
    "Wednesday Books",
    "Thomas Dunne Book",
    "St. Martin's Press"
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Endpoint for finding a book's publisher by title
app.post('/findPublisher', async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Book title is required' });
    }

    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            // Assuming the first search result is the book you're interested in
            const book = data.docs[0];
            const publisher = book.publisher ? book.publisher[0] : 'Publisher information not available';

            let message = '';
            if (boycottedPublishers.includes(publisher)) {
                message = `This publisher is an affiliate of St Martin's Press. 
                           The boycott of St. Martin’s Press, Wednesday Books, and other related imprints 
                           is a direct response to the publisher’s lack of accountability regarding 
                           statements made by an employee in their marketing department and their 
                           failure to respond to concerns about possible systemic issues within the department.

                                     
                           Found more information about how you can help here: https://r4acollective.org/speakupsmp/`;
            }

            res.json({ publisher, message }); // Include the message in the response
        } else {
            res.status(404).json({ error: "Can't find, please do your own research to find who the publisher is" });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
