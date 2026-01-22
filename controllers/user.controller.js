const Users = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

// --- User Signup ---
exports.signup = async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({
                success: false,
                errors: "Existing user found with same email address"
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); 

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword, // <-- Use the hashed password
            cartData: {}
        });

        await user.save(); 

        const data = { user: { id: user.id } };
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ success: true, token });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- User Login ---
exports.login = async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ success: false, errors: "Wrong Email ID" });
    }

    // --- Password Comparison Logic ---
    const passCompare = await bcrypt.compare(req.body.password, user.password); 
    
    if (passCompare) {
        const data = { user: { id: user.id } };
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token });
    } else {
        res.json({ success: false, errors: "Wrong Password" });
    }
};