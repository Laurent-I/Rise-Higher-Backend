const express = require('express');
const mongoose = require('mongoose');
const {DB_HOST, DB_NAME, DB_PORT, PORT} = require('./config.js')
const app = express();

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/UserRoutes');
const profileRoutes = require('./routes/ProfileRoutes');
const jobRoutes = require('./routes/JobRoutes');


app.use('/api/v1/', userRoutes);
app.use('/api/v1/', profileRoutes);
app.use('/api/v1/', jobRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const port = PORT || 3000;
const mongoURI = `mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
})
.catch(err => {
    console.error(err);
});