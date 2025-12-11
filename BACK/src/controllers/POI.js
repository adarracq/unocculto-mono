const POI = require('../models/POI');

exports.getByID = async (req, res, next) => {
    try {
        const poi = await POI.find({ _id: req.params.id });
        res.status(200).json(poi);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getByChapterID = async (req, res, next) => {
    try {
        const pois = await POI.find({ chapterID: req.params.chapterID });
        res.status(200).json(pois);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getByCourseID = async (req, res, next) => {
    try {
        const pois = await POI.find({ courseID: req.params.courseID });
        res.status(200).json(pois);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.create = async (req, res, next) => {
    try {
        // first delete _id if any
        delete req.body._id;
        const newPOI = new POI({ ...req.body });

        const existingPOI = await POI.findOne({ name: newPOI.name });
        if (existingPOI) {
            const updatedPOI = await POI.findOneAndUpdate(
                { name: newPOI.name },
                { ...req.body },
                { new: true }
            );
            res.status(200).json(updatedPOI);
        }
        else {
            const savedPOI = await newPOI.save();
            res.status(201).json(savedPOI);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createMany = async (req, res, next) => {
    try {
        const poisData = req.body.pois; // Expecting an array of POI objects
        const createdPOIs = await POI.insertMany(poisData);
        res.status(201).json(createdPOIs);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

exports.deleteAllPOIs = async (req, res, next) => {
    try {
        const result = await POI.deleteMany({});
        res.status(200).json({ message: `Deleted ${result.deletedCount} POIs.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};