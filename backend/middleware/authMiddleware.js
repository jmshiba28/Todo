const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};






// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const authHeader = req.header('Authorization');
//     console.log('Authorization Header:', authHeader); // Log the Authorization header

//     if (!authHeader) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     try {
//         const token = authHeader.replace('Bearer ', '');
//         console.log('Extracted Token:', token); // Log the extracted token

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded Token:', decoded); // Log the decoded token

//         req.user = decoded; // Attach user info to the request
//         next();
//     } catch (err) {
//         console.error('Token Verification Error:', err.message); // Log error details
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };
