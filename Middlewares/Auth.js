const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ Message: "Unauthorized, jwt is required" });
    }

    // Handle different token formats
    let token;
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        token = authHeader; // Accept token without "Bearer" prefix
    }

    if (!token) {
        return res.status(403).json({ Message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification error:', err.message);
        return res.status(403).json({ 
            Message: "Unauthorized, jwt is wrong or expired",
            Error: err.message // Include specific error message
        });
    }
};

module.exports = ensureAuthenticated;