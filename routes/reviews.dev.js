"use strict";

var express = require('express');

var fs = require('fs');

var path = require('path');

var router = express.Router(); // POST route to handle review submission

router.post('/submit-review', function (req, res) {
  var _req$body = req.body,
      productId = _req$body.productId,
      rating = _req$body.rating,
      review = _req$body.review; // Load existing reviews

  var reviewsFilePath = path.join(__dirname, '../data/reviews.json');
  var reviews = JSON.parse(fs.readFileSync(reviewsFilePath, 'utf8')); // Add the new review

  var newReview = {
    productId: productId,
    rating: rating,
    review: review,
    date: new Date()
  };
  reviews.push(newReview); // Save the updated reviews back to the file

  fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf8'); // Redirect back to the product page or send a response

  res.redirect("/product/".concat(productId));
});
module.exports = router;