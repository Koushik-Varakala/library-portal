import mongoose from 'mongoose';

const gameScoreSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    gameType: {
        type: String,
        required: true,
        enum: ['counter', 'bookshelf']
    },
    score: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    timeTaken: {
        type: Number // in seconds
    },
    datePlayed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const GameScore = mongoose.model('GameScore', gameScoreSchema);

export default GameScore;