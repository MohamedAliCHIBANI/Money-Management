const jwt = require('jsonwebtoken');
const SECRET_KEY = '123456789'; // Replace this with your own secret key

// Middleware to authenticate token
exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).send('Access Denied: No token provided');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verify token
        req.user = decoded; // Attach decoded user info to request
        next(); // Proceed to next middleware/route handler
    } catch (err) {
        return res.status(403).send('Invalid Token');
    }
};
