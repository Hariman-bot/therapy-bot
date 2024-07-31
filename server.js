// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to reset session on server start
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

app.use((req, res, next) => {
    req.session.conversation = []; // Reset the conversation
    next();
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/message', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post('https://api.gemini.com/v1/your-endpoint', {
            prompt: message,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
            }
        });
        res.json({ reply: response.data.choices[0].text.trim() });
    } catch (error) {
        res.status(500).send('Error processing the message');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
