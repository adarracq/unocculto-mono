const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const EntitySnapshot = require('../models/EntitySnapshot');
const Entity = require('../models/Entity');

// Charger l'env
dotenv.config({ path: path.join(__dirname, '../../.env') });

// --- CONFIGURATION MAÎTRESSE ---
// C'est ici que tu listes UNIQUEMENT les peuples que tu veux garder dans ton jeu.
// La clé (gauche) doit correspondre au "NAME" ou "Label" dans le GeoJSON.
const TARGET_CIVS = {
    // ANTIQUITÉ
    "Roman Republic": { color: "#E74C3C", type: "REPUBLIC", displayName: "République Romaine" },
    "Roman Empire": { color: "#E74C3C", type: "EMPIRE", displayName: "Empire Romain" },
    //"Carthage": { color: "#8E44AD", type: "EMPIRE", displayName: "Empire Carthaginois" },
    //"Han": { color: "#F1C40F", type: "EMPIRE", displayName: "Dynastie Han" }, // Vérifie si c'est "Han" ou "Han Dynasty" dans tes fichiers
    //"Macedon": { color: "#3498DB", type: "EMPIRE", displayName: "Royaume de Macédoine" },
    //"Egypt": { color: "#F39C12", type: "KINGDOM", displayName: "Égypte Ptolémaïque" },

    // MOYEN-ÂGE (Exemples à compléter selon tes fichiers)
    //"Frankish Kingdom": { color: "#2980B9", type: "KINGDOM", displayName: "Royaume des Francs" },
    //"Holy Roman Empire": { color: "#FFFF00", type: "EMPIRE", displayName: "Saint-Empire" },

    // ÉPOQUE MODERNE
    //"France": { color: "#0055A4", type: "NATION", displayName: "France" },
    //"United States": { color: "#2C3E50", type: "NATION", displayName: "États-Unis" },
    // ... Ajoute tes 52 fichiers ici au fur et à mesure que tu découvres les noms exacts
};

// --- FONCTION UTILITAIRE : Extraire l'année du nom de fichier ---
// Ex: "world_bc200.geojson" -> -200
// Ex: "world_1945.geojson" -> 1945
const getYearFromFilename = (filename) => {
    const lowerName = filename.toLowerCase();

    // Regex pour chercher les motifs type "bc200", "200bc", ou juste "1900"
    // On suppose que tes fichiers contiennent soit "bc" + nombre, soit juste nombre.

    // Cas 1 : Année Avant JC (BC)
    if (lowerName.includes('bc')) {
        const match = lowerName.match(/bc[_]?(\d+)/) || lowerName.match(/(\d+)[_]?bc/);
        if (match && match[1]) return -parseInt(match[1]);
    }

    // Cas 2 : Année Après JC (AD)
    const match = lowerName.match(/world[_]?(\d+)/) || lowerName.match(/(\d{3,4})/); // Cherche 3 ou 4 chiffres
    if (match && match[1]) return parseInt(match[1]);

    return null;
};

const seedAllData = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI manquant");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔌 Connexion DB établie.");

        const dataDir = path.join(__dirname, '../../data-seed');

        // 1. Lire tous les fichiers du dossier
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.geojson') || file.endsWith('.json'));

        console.log(`📂 ${files.length} fichiers trouvés. Démarrage du traitement...`);
        console.log('------------------------------------------------');

        for (const file of files) {
            // 2. Déterminer l'année
            const year = getYearFromFilename(file);

            if (year === null) {
                console.warn(`⚠️  Impossible de déterminer l'année pour : ${file} (Ignoré)`);
                continue;
            }

            console.log(`Processing ${file} (Année : ${year})...`);

            // 3. Lire le contenu
            const rawData = fs.readFileSync(path.join(dataDir, file), 'utf-8');
            const jsonData = JSON.parse(rawData);
            const features = jsonData.features || [];

            let addedCount = 0;

            for (const feature of features) {
                // 4. Trouver le nom (Gestion des variantes GeoJSON sales)
                const props = feature.properties;
                const rawName = props.NAME || props.Name || props.name || props.LABEL || props.Label || props.title;

                // Si pas de nom ou si le nom n'est pas dans notre "Target List", on saute
                if (!rawName || !TARGET_CIVS[rawName]) continue;

                const config = TARGET_CIVS[rawName];
                const displayName = config.displayName || rawName;

                // 5. Upsert de l'Entité (On la crée si elle existe pas)
                let entity = await Entity.findOne({ name: displayName });
                if (!entity) {
                    entity = await Entity.create({
                        name: displayName,
                        type: config.type,
                        primaryColor: config.color
                    });
                }

                // 6. Upsert du Snapshot (On écrase si déjà existant pour cette année)
                // L'option upsert: true fait le travail de "create or update"
                await EntitySnapshot.findOneAndUpdate(
                    { entityId: entity._id, year: year },
                    {
                        entityId: entity._id,
                        year: year,
                        geometry: feature.geometry
                    },
                    { upsert: true, new: true }
                );

                addedCount++;
            }

            if (addedCount > 0) {
                console.log(`   ✅ ${addedCount} zones importées pour l'année ${year}.`);
            }
        }

        console.log('------------------------------------------------');
        console.log('🎉 Importation terminée !');
        process.exit();

    } catch (error) {
        console.error("❌ Erreur critique:", error);
        process.exit(1);
    }
};

seedAllData();