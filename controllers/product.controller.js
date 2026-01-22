const Product = require('../models/Product.model');

// --- File Upload ---
exports.uploadImage = (req, res) => {
    // The 'upload' middleware already saved the file.
    // We just return the URL.
    res.json({
        success: 1,
        image_url: `http://localhost:${process.env.PORT || 4000}/images/${req.file.filename}`
    });
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
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    });
};

// --- Get All Products ---
exports.getAllProducts = async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
};

// --- Get New Collections ---
exports.getNewCollections = async (req, res) => {
    // Sort by date descending and take the first 8
    let products = await Product.find({}).sort({ date: -1 }).limit(8);
    console.log("New Collection Fetched");
    res.send(products);
};

// --- Get Popular in Women ---
exports.getPopularInWomen = async (req, res) => {
    let products = await Product.find({ category: "women" }).limit(4);
    console.log("Popular in women fetched");
    res.send(products);
};