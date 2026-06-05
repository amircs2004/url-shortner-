const { check, validationResult } = require('express-validator'); 

const validateRequest = (req , res , next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 
    next()
} 
const registerValidation = [
    check('username').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    validateRequest // Added here to catch errors immediately
];

const loginValidation = [
    check('email').isEmail(),
    check('password').exists(),
    validateRequest // Added here to catch errors immediately
];
module.exports = {
    registerValidation,
    loginValidation
};