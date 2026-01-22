const Users = require('../models/User.model');

// --- Add to Cart ---
exports.addToCart = async (req, res) => {
    try {
        const updateKey = `cartData.${req.body.itemId}`;
        
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { $inc: { [updateKey]: 1 } },
            { new: true, upsert: true } // upsert creates field if not exist
        );

        res.send("Added");
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).send("Error adding to cart");
    }
};

// --- Remove from Cart ---
exports.removeFromCart = async (req, res) => {
    try {
        // Find the user first to check the current count
        let userData = await Users.findOne({ _id: req.user.id });
        const itemId = req.body.itemId;

        if (userData.cartData[itemId] > 0) {
            const updateKey = `cartData.${itemId}`;
            await Users.findOneAndUpdate(
                { _id: req.user.id },
                { $inc: { [updateKey]: -1 } }
            );
            res.send("Removed");
        } else {
            res.send("Item not in cart or quantity is zero");
        }
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).send("Error removing from cart");
    }
};

// --- Get Cart Data ---
exports.getCart = async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
};