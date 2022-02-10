const { Schema, model } = require("mongoose");
console.log("model:", model);

const schema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Profession", schema);
