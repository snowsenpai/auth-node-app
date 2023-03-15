const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store  = require('store2');
const {validationResult} = require('express-validator');

const User = require('../models/user');

exports.gethello = (req, res, next) => {
    // req.userId is set after a user successfully logs in
    // user =>{} is the callback function used as an argument for each User:model method
    // 
    User.findById(req.userId,user =>{
        if(user.role.toString() === 'ADMIN'){
             return res.redirect('/all_users');
        }
        res.render('hello',{
            pageTitle:'Hello',
            userData:user
        });
    });
}

exports.getSignup = (req, res, next) => {
    res.render('signup',{
        pageTitle:'Signup',
        // persist user data
        oldInputs:{
            email:'',
            password:'',
            confirmPassword:'',
            firstName:'',
            lastName:'',
            address:'',
        },
        validationErrorMessage:null
    });
}

exports.postSignup = (req, res, next) => {
    const {email, password,confirmPassword, address, firstName, lastName} = req.body;
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return  res.render('signup',{
                pageTitle:'Signup',
                oldInputs:{
                    email:email,
                    password:password,
                    confirmPassword:confirmPassword,
                    firstName:firstName,
                    lastName:lastName,
                    address:address,
                },
                validationErrorMessage:errors.array()[0].msg
            });
        }
        // check if email already exist
        User.findByEmail(email,async userDocument =>{
            if(userDocument){
                return res.render('signup',{
                    pageTitle:'Signup',
                    oldInputs:{
                        email:email,
                        password:password,
                        confirmPassword:confirmPassword,
                        firstName:firstName,
                        lastName:lastName,
                        address:address,
                    },
                    validationErrorMessage:'Email already exist, use another'
                });
            }
            const hashedPassword = await bcrypt.hash(password, 12);

        
            const user = new User(null, email, hashedPassword,firstName, lastName, address, null);

            user.save();
            res.redirect('/login');
        });
    } catch (error) {
        next(error)
    }  
}

exports.getLogin = (req, res, next) => {
    // persist user data
    res.render('login',{
        pageTitle:'Login',
        oldInputs:{
            email:'',
            password:''
        },
        validationErrorMessage:null
        
    });
}

exports.postLogin =  (req, res, next) => {
    const {email, password} = req.body
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return  res.render('login',{
                pageTitle:'Login',
                oldInputs:{
                    email:email,
                    password:password,
                },
                validationErrorMessage:errors.array()[0].msg
            });
        }

        User.findByEmail(email, async user=>{
            // validate email, if user exist
            if (!user) {
                return res.render('login',{
                    pageTitle:'Login',
                    oldInputs:{
                        email:email,
                        password:password,
                    },
                    validationErrorMessage:'Invalid email or password'
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

                store('userSession', token);
                return res.redirect('/');
            }
            // send error message for none match
            return res.render('login',{
                pageTitle:'Login',
                oldInputs:{
                    email:email,
                    password:password,
                },
                validationErrorMessage:'Invalid email or password'
            });
            
        });
    } catch (error) {
        next(error);
    }
}

exports.getUpdateUser = (req, res, next) => {
    const userId = req.params.userId;
    
    User.findById(userId, userObject =>{
        res.render('update_user',{
            pageTitle:'Update User',
            user:userObject,
            validationErrorMessage:null
        });
    });
}

exports.postUpdateUser = (req, res, next) => {
    const {userId, email, firstName, lastName, updatedAddress, role, password} = req.body;
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return User.findById(userId, userObject =>{
                return res.render('update_user',{
                    pageTitle:'Update User',
                    user:userObject,
                    validationErrorMessage:errors.array()[0].msg
                });
            });
        }

        const updatedUser = new User(
            userId,
            email,
            password,
            firstName,
            lastName,
            updatedAddress,
            role
        );
        updatedUser.save();

        res.redirect('/');
    } catch (error) {
        next(error)
    }
}

exports.getAllUsers = (req, res, next) => {
    User.fetchAllUsers(users =>{
        res.render('all_users',{
            pageTitle:'All Users',
            usersArray:users
        });
    });
}