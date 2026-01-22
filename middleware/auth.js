const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    try {
        // 1. Get the token from the 'Authorization' header
        const authHeader = req.header('Authorization');

        // 2. Check if the header exists
        if (!authHeader) {
            return res.status(401).send({ errors: "Please authenticate using a valid token (No header)" });
        }

        // 3. Check if it starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).send({ errors: "Invalid token format (No 'Bearer ')" });
        }

        // 4. Get just the token part by splitting the string
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send({ errors: "Invalid token format (No token)" });
        }

        // 5. Verify the token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not set in environment variables");
            return res.status(500).send({ errors: "Server configuration error" });
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

module.exports = fetchUser;