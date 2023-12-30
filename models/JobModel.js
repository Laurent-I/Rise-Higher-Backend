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

JobSchema.pre('remove',  {document:true}, async function(next){
    try {
        //Get the user who created the job
        const user = await this.model('User').findById(this.createdBy);

        // Remove the job from the user's createdJobs array 
        user.createdJobs.pull(this._id); 
        user.applications.pull(this._id);   

        // Save the user
        await user.save();

        next();
    } catch (error) {
        next(error)
    }
})

module.exports = mongoose.model('Job', JobSchema)