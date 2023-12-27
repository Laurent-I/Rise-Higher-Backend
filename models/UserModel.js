const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const BCRYPT_SALT_ROUNDS = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already exists'],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role:{
        type: String,
        enum: ['employee', 'client', 'admin'],
        default: 'employee',
        required: true
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    applications:[{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],
    createdJobs:[{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, { timestamps: true });

// Hash the password before saving it to the database
UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(BCRYPT_SALT_ROUNDS, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// Add a pre 'remove' hook to delete the associated profile, applications, and createdJobs
UserSchema.pre('remove', async function (next) {
    try {
      // Delete the associated profile
      await this.model('Profile').deleteOne({ _id: this.profile });
  
      // Delete the associated applications
      await this.model('Job').updateMany(
        { applicants: this._id },
        { $pull: { applicants: this._id } }
      );
  
      // Empty the createdBy field in jobs
      await this.model('Job').updateMany(
        { createdBy: this._id },
        { $unset: { createdBy: 1 } }
      );
  
      // Empty the applicants field in jobs
      await this.model('Job').updateMany(
        { applicants: this._id },
        { $pull: { applicants: this._id } }
      );
  
      next();
    } catch (error) {
      next(error);
    }
  });

// Compare the password given with the password in the database
UserSchema.methods.comparePassword = async function (password) {
    const isMatch= await bcrypt.compare(password, this.password);
    return isMatch; 
}

// Password Complexity Validation
UserSchema.path('password').validate(function (value) {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{6,}$/;
    return passwordRegex.test(value);
}, 'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 6 characters long.');

// Password Reset Token and Expiration
UserSchema.add({
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
});

// Input Sanitization
UserSchema.pre('save', function (next) {
    this.username = validator.escape(this.username);
    this.email = validator.normalizeEmail(this.email);
    next();
});

// Logging
UserSchema.post('save', function (doc, next) {
    console.log('User saved:', doc);
    next();
});

// Indexing
UserSchema.index({ username: 1, email: 1 });

module.exports = mongoose.model('User', UserSchema);