"use strict";

var express = require("express");

var supplements = require("./supplements.json"); // Ensure the path is correct


var router = express.Router(); // Display favorites page

router.get("/", function (req, res) {
  var favorites = req.session.favorites || [];
  res.render("favorites", {
    favorites: favorites
  });
}); // Add product to favorites

router.post("/add", function (req, res) {
  var itemId = req.body.id;
  var supplementToAdd = supplements.find(function (sup) {
    return sup.id == itemId;
  });

  if (!req.session.favorites) {
    req.session.favorites = []; // Initialize favorites array in session if it doesn't exist
  } // Check if the supplement is already in favorites to prevent duplicates


  var isAlreadyFavorite = req.session.favorites.some(function (item) {
    return item.id == itemId;
  });

  if (!isAlreadyFavorite && supplementToAdd) {
    req.session.favorites.push(supplementToAdd);
  } // Redirect to the favorites page


  res.redirect("/favorites"); // Adjusted to redirect to the correct favorites page
});
router.post('/remove-from-favorites/:id', function (req, res) {
  var itemId = req.params.id;
  console.log("removing item with ID: ".concat(itemId, " from favorites")); // Corrected

  req.session.favorites = req.session.favorites.filter(function (item) {
    return item.id.toString() !== itemId;
  });
  console.log("Redirecting to favorites. Updated favorites: ".concat(JSON.stringify(req.session.favorites))); // Debug log
  // After removing the item from the favorites array, redirect to the favorites page.

  res.redirect('/favorites');
});
module.exports = router;