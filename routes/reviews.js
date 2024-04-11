const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const supplements = require("./supplements.json");

// POST route to handle review submission
router.post("/submit-review", (req, res) => {
  const { productId, name, review, rating } = req.body;

  // Load existing reviews
  const supplementToAddReview = supplements.find((sup) => sup.id == productId);
  supplementToAddReview.reviews.push({
    author: name,
    rating: rating,
    comment: review,
  });

  // Save the updated reviews back to the file
  const updatedSupplements = supplements.map((sup) =>
    sup.id === productId
      ? {
          ...sup,
          reviews: [
            ...sup.reviews,
            { author: name, rating: rating, comment: review },
          ],
        }
      : sup,
  );

  fs.writeFileSync(
    path.join(__dirname, "supplements.json"),
    JSON.stringify(updatedSupplements, null, 2),
    "utf8",
  );

  // Redirect back to the product page or send a response
  res.redirect(`/product/${productId}`);
  // res.render("productlist", { product: productId });
});

module.exports = router;
