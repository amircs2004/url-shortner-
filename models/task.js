const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, // References the User's _id
        ref: 'User',                           // Tells Mongoose which collection to look in
        required: [true, 'A task must be assigned to an employee']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);