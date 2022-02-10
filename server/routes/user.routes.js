const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const router = express.Router({ mergeParams: true });

router.patch("/:userId", auth, async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("req.user:", req.user);

        if (userId === req.user._id) {
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
                new: true
            });
            res.send(updatedUser);
        } else {
            res.status(401).json({
                message: "Unauthorized"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error has occurred on the server.Try later."
        });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        console.log("req.user__get:", req.user);
        const list = await User.find();
        return res.send(list);
    } catch (error) {
        res.status(500).json({
            message: "An error has occurred on the server. Try later"
        });
    }
});

module.exports = router;
