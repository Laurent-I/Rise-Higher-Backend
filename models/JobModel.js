const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const JobSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: 3,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
        required: true
    },
    isRemote: {
        type: Boolean,
        default: true,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicants:[ {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema)