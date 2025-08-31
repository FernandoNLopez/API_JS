import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Subscription name is required.'],
    trim: true,
    minLength: 3,
    maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required.'],
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'ARS'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['monthly', 'trimestry', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past.',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDay;
            },
            message: 'Renewal date must be after the start day.'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }

}, {  timestamps: true  });


//Auto Calculate the renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {

        const renewalPeriods = {
            monthly: 30,
            trimestry: 90,
            yearly: 365,
        };

        //set renewaldate
        this.renewalDate = new Date(this.startDate);
        //increment date with the frecuency 
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    };

    //Auto-update the status if the renewal date has changed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

//create the model with the schema
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;ii