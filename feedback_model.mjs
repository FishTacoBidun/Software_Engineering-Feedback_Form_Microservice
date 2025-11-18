// File: feedback_model.mjs
// Feedback microservice database model
// Programmers: Wolfie Essink

import mongoose from 'mongoose';
import 'dotenv/config';

const FEEDBACK_DB_NAME = 'feedback_db';

let connectionFeedback = undefined;

async function connectToFeedbackDB() {
    try {
        connectionFeedback = await mongoose.connect(
            process.env.MONGODB_CONNECT_STRING, 
            { dbName: FEEDBACK_DB_NAME }
        );
        console.log("Successfully connected to MongoDB - Feedback DB");
    } catch (err) {
        console.log(err);
        throw Error(`Could not connect to MongoDB - Feedback DB ${err.message}`);
    }
}

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    category:    { type: String, required: true, enum: ['bug report', 'feedback', 'other'] },
    message:     { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

// Compile model
const Feedback_Data = mongoose.model("Feedback_Data", feedbackSchema);

/**
 * Creates a new feedback entry
 * @param {string} name 
 * @param {string} email 
 * @param {string} category 
 * @param {string} message 
 * @returns feedback entry
 */
const create_feedback = async (name, email, category, message) => {
    const feedback = new Feedback_Data({ name, email, category, message });
    return feedback.save();
};

/**
 * Returns all feedback
 */
const getAllFeedback = async () => {
    const query = Feedback_Data.find();
    return query.exec();
};

export { connectToFeedbackDB, create_feedback, getAllFeedback };