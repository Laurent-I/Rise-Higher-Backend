const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const reviewSchema = new Schema({
    reviewer:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    description:{
        type:String,
        required:true
    },
});

reviewSchema.index({rating: 'text', description: 'text'});

module.exports = mongoose.model('Review', reviewSchema);