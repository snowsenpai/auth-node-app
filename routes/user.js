const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

// user authentication middleware
const userAuthenticated = require('../middleware/userAuthentication');

// middleware to route access depending on user's role
const { isAdmin, isUser } = require('../middleware/routeAccess');

// input validations using express-validator
const {validateLogin, validateSignUp, validateUserUpdate} = require('../util/validateUserInput');

// forEach router method request is parsed 
// from top to bottom before reaching their target controller functions
router.get('/',
    userAuthenticated,
    isUser,
    userController.gethello);

router.get('/login', 
    userController.getLogin);

router.post('/login',
    validateLogin,
    userController.postLogin);

router.get('/signup', 
    userController.getSignup);

router.post('/signup',
    validateSignUp,
    userController.postSignup);

router.get('/update_user/:userId',
    userAuthenticated,
    isUser, 
    userController.getUpdateUser);

router.post('/update_user',
    validateUserUpdate,
    userAuthenticated,
    userController.postUpdateUser);


router.get('/all_users', 
    userAuthenticated,
    isAdmin,
    userController.getAllUsers);

module.exports = router;