const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()
const rateLimit = require('express-rate-limit');

const app = express();


const userRoutes = require('./routes/user');
const entityRoutes = require('./routes/entity');
const POIroutes = require('./routes/POI');
const CourseRoutes = require('./routes/course');
const ChapterRoutes = require('./routes/chapter');
const ThemeRoutes = require('./routes/theme');
const EntityRoutes = require('./routes/entity');
const EntitySnapshotsRoutes = require('./routes/entitySnapshots');

mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !' + error));

app.use(express.json());

// Set up rate limiter: maximum of 100 requests per 2 minutes per IP
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again after 10 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    getKey: (req) => {
        return req.headers['x-forwarded-for'] || req.ip;
    },
});

// Apply the rate limiter to all requests
app.use(limiter);


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/entity', entityRoutes);
app.use('/api/poi', POIroutes);
app.use('/api/course', CourseRoutes);
app.use('/api/chapter', ChapterRoutes);
app.use('/api/theme', ThemeRoutes);
app.use('/api/entity', EntityRoutes);
app.use('/api/entitySnapshots', EntitySnapshotsRoutes);
module.exports = app;