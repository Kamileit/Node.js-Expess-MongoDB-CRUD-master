const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var employeeSchema = new mongoose.Schema({
    equipment: {
        type: String
    },
    warranty: {
        type: Date
    },
    release: {
        type: Date
    },
    cost: {
        type: Number
    },
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String
    },
    email3: {
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    }
});

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('Employee', employeeSchema);