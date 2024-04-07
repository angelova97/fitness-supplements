const express = require('express');
const router = express.Router();

// Assuming the JSON file is in the same directory as your `search.js`
const supplements = require('./supplements.json');

router.get('/', function(req, res, next) {
    // Get the search query from the URL query string
    const searchQuery = req.query.q || '';

    // Filter the supplements data based on the search query
    const searchResults = supplements.filter(supplement => 
      supplement.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Respond with JSON
    res.json(searchResults);
});

module.exports = router;
