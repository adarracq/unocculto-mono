const Chapter = require('../models/Chapter');
const mongoose = require('mongoose');
const User = require('../models/User');
const POI = require('../models/POI');
const Theme = require('../models/Theme');

exports.getByID = async (req, res, next) => {
    try {
        const chapter = await Chapter.find({ _id: req.params.id });
        res.status(200).json(chapter);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const chapters = await Chapter.find();

        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

exports.getByCourseID = async (req, res, next) => {
    try {
        const courseID = req.params.courseID;
        const chapters = await Chapter.find({ courseID: courseID });

        res.status(200).json(chapters);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

exports.create = async (req, res, next) => {
    try {
        // first delete _id if any
        delete req.body._id;
        const newChapter = new Chapter({ ...req.body });

        const existingChapter = await Chapter.findOne({ name: newChapter.name });
        if (existingChapter) {
            const updatedChapter = await Chapter.findOneAndUpdate(
                { name: newChapter.name },
                { ...req.body },
                { new: true }
            );
            res.status(200).json(updatedChapter);
        }
        else {
            const savedChapter = await newChapter.save();
            res.status(201).json(savedChapter);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getChapterStats = async (req, res, next) => {
    try {
        // 1. Récupération des paramètres
        const chapterID = req.params.chapterID;
        const userID = req.params.userID;

        // 2. On récupère d'abord le joueur pour avoir sa liste de POIs
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // 3. Récupérer tous les thèmes existants
        const allThemes = await Theme.find({}, '_id name');

        // On sécurise le tableau des POIs complétés
        const completedPOIIDs = (user.POIsCompleted || []).map(id => new mongoose.Types.ObjectId(id));

        // 4. On lance l'agrégation sur les POIs pour obtenir les stats réelles
        const poiStats = await POI.aggregate([
            // Filtre: Seulement les POIs de ce chapitre
            {
                $match: {
                    chapterID: new mongoose.Types.ObjectId(chapterID)
                }
            },

            // On sépare les thèmes (un POI avec 2 thèmes comptera pour les deux)
            { $unwind: "$themes" },

            // Le calcul
            {
                $group: {
                    _id: "$themes", // On groupe par l'ID du thème
                    totalPOIs: { $sum: 1 }, // Compteur total
                    completedPOIs: {
                        $sum: {
                            $cond: [
                                // Est-ce que l'ID du POI est dans la liste du user ?
                                { $in: ["$_id", completedPOIIDs] },
                                1, // Oui : +1
                                0  // Non : +0
                            ]
                        }
                    }
                }
            }
        ]);

        // 5. Créer un Map pour faciliter la recherche des stats
        const poiStatsMap = new Map();
        poiStats.forEach(stat => {
            poiStatsMap.set(stat._id.toString(), stat);
        });

        // 6. Construire le résultat final avec tous les thèmes
        const stats = allThemes.map(theme => {
            const themeStats = poiStatsMap.get(theme._id.toString());

            if (themeStats) {
                // Thème avec des POIs
                return {
                    themeID: theme._id,
                    name: theme.name,
                    total: themeStats.totalPOIs,
                    completed: themeStats.completedPOIs,
                };
            } else {
                // Thème sans POIs dans ce chapitre
                return {
                    themeID: theme._id,
                    name: theme.name,
                    total: 0,
                    completed: 0,
                };
            }
        });

        return res.status(200).json(stats);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur lors du calcul des statistiques' });
    }
};