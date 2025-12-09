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
        // first delete _id if any
        delete req.body._id;
        const newCourse = new Course({ ...req.body });

        const existingCourse = await Course.findOne({ name: newCourse.name });
        if (existingCourse) {
            const updatedCourse = await Course.findOneAndUpdate(
                { name: newCourse.name },
                { ...req.body },
                { new: true }
            );
            res.status(200).json(updatedCourse);
        }
        else {
            const savedCourse = await newCourse.save();
            res.status(201).json(savedCourse);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};