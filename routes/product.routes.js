const express = require('express');
const router = express.Router();

// Import controllers and middleware
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload');

// All URLs here are prefixed with '/api' (from index.js)

// /api/upload
router.post('/upload', (req, res, next) => {
    upload.single('product')(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ success: false, error: err.message });
        }
        productController.uploadImage(req, res);
    });
});

// /api/addproduct
router.post('/addproduct', productController.addProduct);

// /api/removeproduct
router.post('/removeproduct', productController.removeProduct);

// /api/allproducts
router.get('/allproducts', productController.getAllProducts);

// /api/newcollections
router.get('/newcollections', productController.getNewCollections);

// /api/popularinwomen
router.get('/popularinwomen', productController.getPopularInWomen);

module.exports = router;