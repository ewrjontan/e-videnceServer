const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const itemSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    locationFound: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    collectedBy: {
        type: String,
    }
}, {
    timestamps: true
});


const incidentSchema = new Schema({
    incidentNumber: {
        type: String,
        required: true,
        unique: true
    },
    incidentLocation: {
        type: String,
        required: true
    },
    nature: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    items: [itemSchema]
}, {
    timestamps: true
});

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;