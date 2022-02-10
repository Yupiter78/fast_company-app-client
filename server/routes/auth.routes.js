const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateUserData } = require("../utils/helpers");
const tokenService = require("../services/token.service");
const { check, validationResult } = require("express-validator");
const router = express.Router({ mergeParams: true });

// /api/auth/signUp
// 1. get data from req (email, password ...)
// 2. check if users already exists
// 3. hash password
// 4. user create
// 5. generate tokens
router.post("/signUp", [
    check("email", "Incorrect email").isEmail(),
    check("password", "Minimum password length 8 characters").isLength({
        min: 8
    }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: "INVALID_DATA",
                        code: 400,
                        errors: errors.array()
                    }
                });
            }
            const { email, password } = req.body;
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    error: {
                        message: "EMAIL_EXISTS",
                        code: 400
                    }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = await User.create({
                ...generateUserData(),
                ...req.body,
                password: hashedPassword
            });

            const tokens = tokenService.generate({ _id: newUser._id });
            await tokenService.save(newUser._id, tokens.refreshToken);

            res.status(201).send({ ...tokens, userId: newUser._id });
        } catch (error) {
            res.status(500).json({
                message: "An error has occurred on the server. Try later."
            });
        }
    }
]);

// validate
// find user
// compare hashed password
// generate tokens
// return data
router.post("/signInWithPassword", [
    check("email", "Incorrect email").normalizeEmail().isEmail(),
    check("password", "Password cannot be empty").exists(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: {
                        message: "INVALID_DATA",
                        code: 400
                    }
                });
            }

            const { email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return res.status(400).send({
                    error: {
                        message: "EMAIL_NOT_FOUND",
                        code: 400
                    }
                });
            }

            const isPasswordEqual = await bcrypt.compare(
                password,
                existingUser.password
            );
            if (!isPasswordEqual) {
                return res.status(400).send({
                    error: {
                        message: "INVALID_PASSWORD",
                        code: 400
                    }
                });
            }

            const tokens = tokenService.generate({
                _id: existingUser._id
            });
            await tokenService.save(existingUser._id, tokens.refreshToken);

            return res
                .status(200)
                .send({ ...tokens, userId: existingUser._id });
        } catch (error) {
            res.status(500).json({
                message: "An error has occurred on the server. Try later"
            });
        }
    }
]);

router.post("/token", async (req, res) => {});

module.exports = router;
