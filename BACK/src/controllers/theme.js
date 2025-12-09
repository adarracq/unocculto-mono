const Theme = require('../models/Theme');

exports.getByID = async (req, res, next) => {
    try {
        const theme = await Theme.find({ _id: req.params.id });

        res.status(200).json(theme);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const themes = await Theme.find();

        res.status(200).json(themes);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

exports.createTheme = async (req, res, next) => {
    try {
        // first delete _id if any
        delete req.body._id;
        const newTheme = new Theme({ ...req.body });

        const existingTheme = await Theme.findOne({ name: newTheme.name });
        if (existingTheme) {
            const updatedTheme = await Theme.findOneAndUpdate(
                { name: newTheme.name },
                { ...req.body },
                { new: true }
            );
            res.status(200).json(updatedTheme);
        }
        else {
            const savedTheme = await newTheme.save();
            res.status(201).json(savedTheme);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};