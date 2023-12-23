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
            validator: function(value){
                return value.length > 0
            },
            message: 'Skills must haev at least one entry'
        }
    },
    experience: {
        type: String,
        required: [true, 'Experience is required'],
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true
        },
        zip: {
            type: String,
            required: [true, 'ZIP code is required'],
            trim: true
        }
    }
}, {
    timestamps: true
});

// Virtual for user's full name
ProfileSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

// Indexing
ProfileSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model('Profile', ProfileSchema)