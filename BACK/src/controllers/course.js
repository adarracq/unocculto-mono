const Course = require('../models/Course');
const mongoose = require('mongoose');
const User = require('../models/User');
const POI = require('../models/POI');

exports.getByID = async (req, res, next) => {
    try {
        const course = await Course.find({ _id: req.params.id });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const courses = await Course.find();

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

exports.create = async (req, res, next) => {
    try {
        const { number, name, labelFR, labelEN, base64Icon } = req.body;

        const newCourse = new Course({
            number,
            name,
            labelFR,
            labelEN,
            base64Icon
        });
        // If theme exists we replace it
        const existingCourse = await Course.findOne({ name });
        if (existingCourse) {
            existingCourse.number = number;
            existingCourse.labelFR = labelFR;
            existingCourse.labelEN = labelEN;
            existingCourse.base64Icon = base64Icon;
            const updatedCourse = await existingCourse.save();
            return res.status(200).json(updatedCourse);
        }
        else {
            // Otherwise we create a new one
            const savedCourse = await newCourse.save();
            return res.status(201).json(savedCourse);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};