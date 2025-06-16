const Joi = require('joi'); 
const { schema } = require('../Models/User');

const signupValidation = (req,res,next) => {
    const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(), // ✅ Fixed
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  });
    const {error} = schema.validate(req.body);
    
    if(error){
        return res.status(400)
        .json({message:"Bad request",error})
    }
    next();
}

const loginValidation = (req,res,next) => {
     const schema = Joi.object({ // Use 'Joi' here, not 'joi'
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
        .json({message:"Bad request",error})
    }
    next();
}

module.exports = {
    signupValidation,
    loginValidation
}

