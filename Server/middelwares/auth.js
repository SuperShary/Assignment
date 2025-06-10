const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    console.log('Auth middleware called');
    console.log('Headers:', req.headers);
    const token = req.headers.authorization;
    console.log('Authorization token:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: "Authentication failed, Token missing" });
    }
    
    try {
        // Extract token if it starts with 'Bearer'
        const tokenString = token.startsWith('Bearer') ? token.slice(7) : token;
        console.log('Token to verify:', tokenString);
        
        const decode = jwt.verify(tokenString, 'secret_key');
        console.log('Decoded token:', decode);
        
        req.user = decode;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
}

module.exports = auth