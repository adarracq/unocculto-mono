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
        const { name, labelFR, labelEN, base64Icon } = req.body;

        const newTheme = new Theme({
            name,
            labelFR,
            labelEN,
            base64Icon
        });
        // If theme exists we replace it
        const existingTheme = await Theme.findOne({ name });
        if (existingTheme) {
            existingTheme.labelFR = labelFR;
            existingTheme.labelEN = labelEN;
            existingTheme.base64Icon = base64Icon;
            const updatedTheme = await existingTheme.save();
            return res.status(200).json(updatedTheme);
        }
        else {
            // Otherwise we create a new one
            const savedTheme = await newTheme.save();
            return res.status(201).json(savedTheme);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};