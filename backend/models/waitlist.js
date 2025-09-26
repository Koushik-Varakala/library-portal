import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    notified: {
        type: Boolean,
        default: false
    },
    notificationDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;