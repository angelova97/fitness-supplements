var express = require("express");
const supplements = require("./supplements.json"); // Ensure the path is correct
var router = express.Router();

// Display favorites page
router.get("/", function (req, res) {
  const favorites = req.session.favorites || [];
  res.render("favorites", { favorites: favorites });
});

// Add product to favorites
router.post("/add", function (req, res) {
  const itemId = req.body.id;
  const supplementToAdd = supplements.find((sup) => sup.id == itemId);

  if (!req.session.favorites) {
    req.session.favorites = []; // Initialize favorites array in session if it doesn't exist
  }

  // Check if the supplement is already in favorites to prevent duplicates
  const isAlreadyFavorite = req.session.favorites.some(
    (item) => item.id == itemId
  );
  if (!isAlreadyFavorite && supplementToAdd) {
    req.session.favorites.push(supplementToAdd);
  }

  // Redirect to the favorites page
  res.redirect("/favorites"); // Adjusted to redirect to the correct favorites page
});

router.post('/remove-from-favorites/:id', function (req, res) {
  const itemId = req.params.id;
  console.log(`removing item with ID: ${itemId} from favorites`); // Corrected

  req.session.favorites = req.session.favorites.filter(item => item.id.toString() !== itemId);
  console.log(`Redirecting to favorites. Updated favorites: ${JSON.stringify(req.session.favorites)}`); // Debug log
  // After removing the item from the favorites array, redirect to the favorites page.
  res.redirect('/favorites');
});


module.exports = router;
