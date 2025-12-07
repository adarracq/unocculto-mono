const Entity = require('../models/Entity');

exports.getByID = async (req, res, next) => {
    try {
        const entitie = await Entity.find({ _id: req.params.id });

        res.status(200).json(entitie);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};