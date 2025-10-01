const express = require('express');
const app = express();
const config = require('./config');

// Body parser for JSON
app.use(express.json());

// Mount routers
const authRoutes = require('./routes/auth');
// const cropPlannerRoutes = require('./routes/cropPlanner'); // Will add these later
// const marketRoutes = require('./routes/market');
// const trackerRoutes = require('./routes/tracker');

// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/crops', cropPlannerRoutes); // Will enable later
// app.use('/api/v1/market', marketRoutes);     // Will enable later
// app.use('/api/v1/tracker', trackerRoutes);   // Will enable later


app.get('/', (req, res) => {
    res.send('Farmlytics API is running...');
});

module.exports = app;