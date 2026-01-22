const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
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
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next(); // All good, proceed to the cart controller
    } catch (error) {
        res.status(401).send({ errors: "Please authenticate using a valid token (Verification failed)" });
    }
};

module.exports = fetchUser;