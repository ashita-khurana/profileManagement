const httpStatus = require('http-status');
const { omit, pick } = require('lodash');
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
 exports.get = (req, res, next) => {
    const user = req.locals.user;
    try{
      if(user.role == "admin")
        throw new APIError({ message: 'User cannot view admin details' });
      const prop = req.query.show;
      if(prop)
          res.json(pick(user, prop));
      else
          res.json(user.transform());
    }
    catch(e){
      next(e);
    }
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
    const updatedUser = omit(req.body, 'role');
    const user = Object.assign(req.locals.user, updatedUser);
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
    const filteredUsers = users.filter(user => user.role == "user");
    const transformedUsers = filteredUsers.map(user => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

