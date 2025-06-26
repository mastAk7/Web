const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.cookies.token;
    if (!token){
        console.log('No token provided')
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        console.log('Token from cookie')
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Invalid token')
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = protect;