// File: feedback_controller.mjs
// Feedback microservice REST API
// Programmers: Wolfie Essink

import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import cors from 'cors';

import { 
    connectToFeedbackDB,
    create_feedback,
    getAllFeedback
} from './feedback_model.mjs';

const PORT = process.env.FEEDBACK_PORT || 4003;
const ERROR_INVALID_REQ = { Error: "Invalid request: all fields are required" };

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to DB on server start
app.listen(PORT, async () => {
    try {
        await connectToFeedbackDB();
        console.log(`Feedback microservice running on port ${PORT}...`);
    } catch (error) {
        console.error("Failed to start Feedback microservice:", error);
    }
});

// POST: Submit feedback
app.post('/api/feedback', asyncHandler(async (req, res) => {
    const { name, email, category, message } = req.body;

    // Validate required fields
    if (!name || !email || !category || !message) {
        res.status(400).json(ERROR_INVALID_REQ);
        return;
    }

    const result = await create_feedback(name, email, category, message);
    res.status(201).json(result);
}));

//GET (optional): Get all feedback entries
app.get('/api/feedback', asyncHandler(async (req, res) => {
    const allFeedback = await getAllFeedback();
    res.status(200).json(allFeedback);
}));