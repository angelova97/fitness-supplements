const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const supplements = require("./supplements.json"); // Make sure the path is correct

router.get('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const product = supplements.find(s => s.id === productId);
  if (product) {
    res.render('productlist', { product: product });
  } else {
    res.status(404).send('Product not found');
  }
});
router.post("/add", function (req, res) {
  const itemId = req.body.id;
  const supplementToAdd = supplements.find((sup) => sup.id == itemId);

  if (!req.session.favorites) {
    req.session.favorites = []; // Initialize favorites array in session if it doesn't exist
  }
});

module.exports = router;