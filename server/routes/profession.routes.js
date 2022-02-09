const express = require("express");
const Profession = require("../models/Profession");
const router = express.Router({ mergeParams: true });

// async (req, res) => {}
router.get("/", async (req, res) => {
    try {
        // const professions = await Profession.find();
        // res.status(200).json({ list: professions });
        const list = await Profession.find();
        res.status(200).send(list);
    } catch (error) {
        res.status(500).json({
            message: "An error has occurred on the server. Try later."
        });
    }
});

module.exports = router;
