const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
const roles = ['user', 'admin'];
const bcrypt = require('bcryptjs');
/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: false,
    minlength: 6,
    maxlength: 128,
  },
  firstName: {
    type: String,
    maxlength: 128,
    trim: true,
    required: true,
  },
  middleName : {
    type: String,
    maxlength: 128,
    trim: true,
    required: false,
  },
  department : {
    type: String,
    maxlength: 128,
    trim: true,
    required: false,
  },
  lastName: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  token: { 
    type: String 
  },
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'email', 'role', 'createdAt', 'firstName', 'lastName','updatedAt', 'middleName','department'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
userSchema.statics = {
   roles,
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      } else if (id.includes('@')) {
        user = await this.findOne({ email: id }).exec();
      } 
      if (user) {
        return user;
      }
    } catch (error) {
      throw error;
    }
  },

  async checkIfUserExistsByEmail({ email }) {
    if (!email) throw new APIError({ message: 'A valid email is required '});
    try {
      const user = await this.findOne({ email }).exec();
      if (user) {
        return user;
      }
      return false;
    } catch (error) {
      throw error;
    }
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 30, email, role
  }) {
    const options = omitBy({ email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
   checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);

