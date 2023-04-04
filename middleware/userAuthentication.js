const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const token = req.body.token;
    if(!token){
        // user not logged in
        return res.status(401).json({
            message:'Not Authorized!, please Login and use token in request body, if you don\'t have an account Signup'
        });
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SIGN);
    } catch (error) {
        throw error
    }
    if (!decodedToken) {
        const error = new Error('Not authorized');
        error.statusCode = 401;
        return error
    }
    req.userId = decodedToken.userId;
    req.isLoggedIn = decodedToken.userLoggedIn;
    req.userRole = decodedToken.userRole;
    next();
}