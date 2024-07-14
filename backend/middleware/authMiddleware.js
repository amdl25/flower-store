const jwt = require('jsonwebtoken');

const fetchUserOptional = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const data = jwt.verify(token, process.env.JWT_SECRET);
                req.user = data.user;
            } catch (error) {
                console.log('Invalid token:', error.message);
                req.user = null;
            }
        }
    } else {
        console.log('No Authorization header found');
    }

    next();
};

module.exports = fetchUserOptional;
