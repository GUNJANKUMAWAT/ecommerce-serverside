const Product = require('../models/Product.model');

// --- File Upload ---
exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        const imageUrl = `${process.env.IMAGE_URL || 'http://localhost:4000'}/images/${req.file.filename}`;
        res.json({
            success: 1,
            image_url: imageUrl
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Add Product ---
exports.addProduct = async (req, res) => {
    try {
        // Find the product with the highest ID
        const lastProduct = await Product.findOne().sort({ id: -1 });
        
        let id;
        if (lastProduct) {
            id = lastProduct.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Remove Product ---
exports.removeProduct = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).json({ success: false, error: 'Product ID required' });
        }
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Removed");
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Get All Products ---
exports.getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All Products Fetched");
        res.send(products);
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Get New Collections ---
exports.getNewCollections = async (req, res) => {
    try {
        let products = await Product.find({}).sort({ date: -1 }).limit(8);
        console.log("New Collection Fetched");
        res.send(products);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Get Popular in Women ---
exports.getPopularInWomen = async (req, res) => {
    try {
        let products = await Product.find({ category: "women" }).limit(4);
        console.log("Popular in women fetched");
        res.send(products);
    } catch (error) {
        console.error("Error fetching popular in women:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};