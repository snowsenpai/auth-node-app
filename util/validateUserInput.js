const { body } = require('express-validator');

module.exports ={
    validateSignUp:[
        body('email')
            .isEmail()
            .withMessage('Please enter a valid Email')
            .normalizeEmail(),
        body('password','Password should be more than 5 characters')
            .isLength({min:5})
            .trim(),
        body('confirmPassword')
            .custom((value,{req}) =>{
                if(value !== req.body.password){
                    throw new Error('Passwords have to match');
                }
                return true
            })
            .trim(),
        body('firstName','First Name should have no special characters nor numbers and must be more than 3 characters')
            .isString()
            .isLength({min:3})
            .trim(),
        body('lastName','Last Name should have no special characters nor numbers and must be more than 3 characters')
            .isString()
            .isLength({min:3})
            .trim(),
        body('address','Address should not be empty')
            .isLength({min:3})
            .trim()
    ],
    validateLogin:[
        body('email')
            .isEmail()
            .withMessage('Please enter a valid Email')
            .normalizeEmail(),
        body('password', 'Please enter a valid password')
            .isLength({min:5})
            .trim(),
    ],
    validateUserUpdate:[
        body('address','Address should not be empty')
            .isLength({min:3})
            .trim()        
    ]
}