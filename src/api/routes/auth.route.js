const express = require('express');
const validate = require('express-validation');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const {
  createUser,
} = require('../validations/admin.validation');

router
  .route("/register")
  .post(validate(createUser),controller.register);

router
  .route("/login")
  .post(controller.login);

module.exports = router;