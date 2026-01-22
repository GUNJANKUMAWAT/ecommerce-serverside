const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const fetchUser = require('../middleware/auth');

// All these routes require the user to be logged in
// so we apply the 'fetchUser' middleware first.

// /api/addtocart
router.post('/addtocart', fetchUser, cartController.addToCart);

// /api/removefromcart
router.post('/removefromcart', fetchUser, cartController.removeFromCart);

// /api/getcart
router.post('/getcart', fetchUser, cartController.getCart);

module.exports = router;