const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const User = require('../models/user');

exports.gethello = (req, res, next) => {
    // req.userId is set after a user successfully logs in
    // user =>{} is the callback function used as an argument for each User:model static method 
    User.findById(req.userId,user =>{
        //create new user object without password
        const {password, ...userDataNoPassword} = user;
        res.status(200).json({
            message:'User found',
            userData:userDataNoPassword
        });
    });
}

exports.postSignup = (req, res, next) => {
    const {email, password, address, firstName, lastName} = req.body;
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const validationErrorMessage = errors.array()[0].msg;

            return res.status(422).json({
                message:'Validation failed',
                error:validationErrorMessage
            });
        }
        // check if email already exist
        User.findByEmail(email,async userDocument =>{
            if(userDocument){
                return res.status(409).json({
                    message:'Signup failed',
                    error:'A user with this email already exist'
                });
            }
            const hashedPassword = await bcrypt.hash(password, 12);

        
            const user = new User(null, email, hashedPassword,firstName, lastName, address, null);

            user.save();
            res.status(201).json({
                message:'User created, you can login'
            });
        });
    } catch (error) {
        next(error)
    }  
}

exports.postLogin =  (req, res, next) => {
    const {email, password} = req.body
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const validationErrorMessage = errors.array()[0].msg;

            return res.status(422).json({
                message:'Validation failed',
                error:validationErrorMessage
            });
        }

        User.findByEmail(email, async user=>{
            // validate email, if user exist
            if (!user) {
                return res.status(422).json({
                    message:'Login failed',
                    error:'Invalid email or password, signup if you don\'t have an account'
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if(passwordMatch){
                const token = jwt.sign(
                    {
                    email:user.email,
                    userId:user.id,
                    userLoggedIn:true,
                    userRole:user.role
                    },
                    process.env.JWT_SIGN,
                    {expiresIn:'1h'}
                );
                // send json msg: logged in, use token for every request can view profile at '/'
                return res.status(200).json({
                    message:'Login successful, use attached \'token\' for future requests expires in 1 hour',
                    token:token,
                    guide:'token should be attached to request body'
                });
            }
            // send error message for none match
            return res.status(422).json({
                message:'Login failed',
                error:'Invalid email or password, signup if you don\'t have an account'
            });
            
        });
    } catch (error) {
        next(error);
    }
}

exports.postUpdateUser = (req, res, next) => {
    const {address} = req.body;
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            const validationErrorMessage = errors.array()[0].msg;

            return res.status(422).json({
                message:'Validation failed',
                error:validationErrorMessage
            });
        }
        // in model: find user by id and update address
        const updatedUser = new User(
            req.userId,
            null,
            null,
            null,
            null,
            address,
            null
        );
        updatedUser.save();
        res.status(201).json({
            message:'Address updated'
        });
    } catch (error) {
        next(error)
    }
}

exports.getAllUsers = (req, res, next) => {
    User.fetchAllUsers(users =>{
        //create new users Array without password
        const usersNoPassword = users.map( ({ password, ...otherFields }) => otherFields);
        res.status(200).json({
            message:'All users retrived successfully',
            users:usersNoPassword
        });
    });
}