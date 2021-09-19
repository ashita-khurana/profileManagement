const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require('../../config/vars');

exports.register = async (req, res, next) => {
try {
    const { email } = req.body;
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
        return res.send("User Already Exist. Please Login");
    }

    const newUser = new User(req.body);
    const user = await newUser.save();

    const token = jwt.sign(
        { user_id: user._id, email },
        jwtSecretKey,
        {
        expiresIn: "2h",
        }
    ); 
    user.token = token;

    res.json(user);
    } catch (err) {
        next(err);
    }
}

exports.login = async (req, res, next) => {
try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
        res.send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
        { user_id: user._id, email },
        jwtSecretKey,
        {
            expiresIn: "2h",
        }
        );

        // save user token
        user.token = token;

        // user
        res.status(200).json(user);
    }
    res.send("Invalid Credentials");
    } catch (err) {
        next(err);
    }
}