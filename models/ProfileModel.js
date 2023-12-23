const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    skills: {
        type: [String],
        required: true,
        validate:{
            validator: function
        }
    },
    experience: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema)