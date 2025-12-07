const EntitySnapshot = require('../models/EntitySnapshot');

// GET /api/entitySnapshots/:year
// Exemple: /api/entitySnapshots/-200 -> Renvoie tous les territoires de l'an -200
exports.getSnapshotsByYear = async (req, res, next) => {
    try {
        const year = parseInt(req.params.year);

        // On cherche tous les snapshots de cette année
        // .populate('entityId') est MAGIQUE : il va remplacer l'ID par l'objet Entity complet (avec le nom et la couleur !)
        const snapshots = await EntitySnapshot.find({ year: year })
            .populate('entityId', 'name primaryColor type');

        res.status(200).json(snapshots);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};