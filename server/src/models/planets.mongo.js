const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    },
    isHabitable: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: "planet_createdAt",
        updatedAt: "planet_updatedAt"
    }
})

module.exports = mongoose.model("Planet", planetSchema);