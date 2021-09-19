const e = require('express');
const httpStatus = require('http-status');
const { pick } = require('lodash');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');


/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next) => {
  try {
    const user = await User.checkIfUserExistsByEmail(req.params);
    req.locals = {
      user,
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
  const user = req.locals.user || User.checkIfUserExistsByEmail(req.params) ;
  const prop = req.query.show;
  if(prop){
      res.json(pick(user, prop));
    }
  else
      res.json(user.transform());
}
  


/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
   
  }
};

/**
 * Update existing user
 * @public
 */

 exports.update = async (req, res, next) => {
  try {
    if(req.body.password)
      throw new APIError({ message: 'Password cannot be altered' });
    const user = Object.assign(req.locals.user, req.body);
    const savedUser = await user.save();
    res.json({ auth: savedUser.transform() });

  } catch (e) {
    next(User.checkDuplicateEmail(e));
  }
};;

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

