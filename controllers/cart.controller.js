const Users = require('../models/User.model');

// --- Add to Cart ---
exports.addToCart = async (req, res) => {
    try {
        if (!req.body.itemId) {
            return res.status(400).json({ success: false, error: 'Item ID required' });
        }

        const updateKey = `cartData.${req.body.itemId}`;
        
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { $inc: { [updateKey]: 1 } },
            { new: true, upsert: true }
        );

        res.send("Added");
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Remove from Cart ---
exports.removeFromCart = async (req, res) => {
    try {
        if (!req.body.itemId) {
            return res.status(400).json({ success: false, error: 'Item ID required' });
        }

        // Find the user first to check the current count
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

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
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Get Cart Data ---
exports.getCart = async (req, res) => {
    try {
        console.log("GetCart");
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json(userData.cartData);
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};