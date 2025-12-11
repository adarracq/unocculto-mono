const Entity = require('../models/Entity');

exports.getByID = async (req, res, next) => {
    try {
        const entitie = await Entity.find({ _id: req.params.id });

        res.status(200).json(entitie);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const entities = await Entity.find();

        res.status(200).json(entities);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

exports.create = async (req, res, next) => {
    try {
        // first delete _id if any
        delete req.body._id;
        const newEntity = new Entity({ ...req.body });
        console.log('Creating entity:', newEntity);

        const existingEntity = await Entity.findOne({ name: newEntity.name });
        if (existingEntity) {
            const updatedEntity = await Entity.findOneAndUpdate(
                { name: newEntity.name },
                { ...req.body },
                { new: true }
            );
            res.status(200).json(updatedEntity);
        }
        else {
            const savedEntity = await newEntity.save();
            res.status(201).json(savedEntity);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};