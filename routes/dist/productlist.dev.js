"use strict";

var express = require("express");

var router = express.Router();

var fs = require("fs");

var path = require("path");

var supplements = require("./supplements.json"); // Make sure the path is correct


router.get('/:productId', function (req, res) {
  var productId = parseInt(req.params.productId, 10);
  var product = supplements.find(function (s) {
    return s.id === productId;
  });

  if (product) {
    res.render('productlist', {
      product: product
    });
  } else {
    res.status(404).send('Product not found');
  }
});
router.post("/add", function (req, res) {
  var itemId = req.body.id;
  var supplementToAdd = supplements.find(function (sup) {
    return sup.id == itemId;
  });

  if (!req.session.favorites) {
    req.session.favorites = []; // Initialize favorites array in session if it doesn't exist
  }
});
module.exports = router;