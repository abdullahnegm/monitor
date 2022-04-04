const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: true
    },
  password: {type: String, required: true},
  targets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Target'}],
  is_active: {type: Boolean, default: 1}
});

userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User