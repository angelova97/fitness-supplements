const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// POST route to handle review submission
router.post('/submit-review', (req, res) => {
  const { productId, rating, review } = req.body;

  // Load existing reviews
  const reviewsFilePath = path.join(__dirname, '../data/reviews.json');
  const reviews = JSON.parse(fs.readFileSync(reviewsFilePath, 'utf8'));

  // Add the new review
  const newReview = { productId, rating, review, date: new Date() };
  reviews.push(newReview);

  // Save the updated reviews back to the file
  fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf8');

  // Redirect back to the product page or send a response
  res.redirect(`/product/${productId}`);
});

module.exports = router;
