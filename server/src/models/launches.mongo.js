const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    customers: {
        type: [ String ],
        required: true
    },
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: {
        createdAt: "launch_createdAt",
        updatedAt: "launch_updatedAt"
    }
});

module.exports = mongoose.model("Launch", launchSchema);