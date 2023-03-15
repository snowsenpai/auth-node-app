const jwt = require('jsonwebtoken');
const store = require('store2');

module.exports = (req, res, next) =>{
    const token = store('userSession');
    if(!token){
        // user not logged in
        return res.redirect('/login');
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SIGN);
    } catch (error) {
        next(error);
    }
    req.userId = decodedToken.userId;
    req.isLoggedIn = decodedToken.userLoggedIn;
    req.userRole = decodedToken.userRole;
    next();
}