const Joi = require('joi');

module.exports = {
  
    // POST /users
    createUser: {
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(12).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid('user'),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      },
    },
  
  
    // PATCH /v1/users/:email
    updateUser: {
      body: {
        email: Joi.string().email().empty(''),
        firstName: Joi.string().empty(''),
        password: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        role: Joi.string().valid('user'),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
      },
    },
    
    getDetails : {
      query : {
        show : Joi.string().invalid('password')
      }
    }
  
  };
  