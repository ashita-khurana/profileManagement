const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/user.controller');
const {
  createUser,
  updateUser,
  getDetails
} = require('../validations/user.validation');
const auth = require("../middleware/auth");
const router = express.Router();


router
  .route('/')
  .get(auth, controller.list)
  .post(auth, validate(createUser), controller.create);

  router.param('email', controller.load);

  router
  .route('/:email')
  .get(auth, validate(getDetails), controller.get)
  .patch(auth, validate(updateUser), controller.update)


module.exports = router;
