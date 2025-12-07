import mongoose from 'mongoose';
import EntitySnapshot from '../models/EntitySnapshot.js';
import Entity from '../models/Entity.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'env pour la connexion
dotenv.config({ path: path.join(__dirname, '../.env') });

// --- CONFIGURATION : C'est ici que tu choisis qui tu gardes ---
// Clé = Le nom EXACT dans ton fichier GeoJSON
// Valeur = Les infos pour créer l'Entité dans ta BDD
const TARGET_CIVS: Record<string, { color: string; type: string; displayName?: string }> = {
    // Exemple pour l'année -200
    // TODO : Remplacer par les vrais noms
    "Roman Republic": { color: "#E74C3C", type: "REPUBLIC", displayName: "République Romaine" },
    "Han Dynasty": { color: "#F1C40F", type: "EMPIRE", displayName: "Dynastie Han" },
    "Carthage": { color: "#8E44AD", type: "EMPIRE", displayName: "Empire Carthaginois" },
    "Parthian Empire": { color: "#2ECC71", type: "EMPIRE", displayName: "Empire Parthe" },

    // Exemple pour d'autres époques (à décommenter quand tu importeras d'autres fichiers)
    // "Kingdom of France": { color: "#3498DB", type: "KINGDOM", displayName: "Royaume de France" },
};

const seedData = async () => {
    try {
        // 1. Connexion
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI manquant dans .env");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔌 Connecté à Mongo pour le seed.");

        // 2. Fichier à importer (Change le nom du fichier ici selon tes besoins)
        const fileName = 'world_-200.json';
        const filePath = path.join(__dirname, '../../data-seed', fileName);

        if (!fs.existsSync(filePath)) {
            throw new Error(`Fichier introuvable: ${filePath}`);
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(rawData);
        // On suppose que l'année est dans le nom du fichier ou dans une propriété du json
        // Ici je prends une année fixe pour l'exemple, mais adapte-le selon ta structure JSON
        const YEAR_IMPORT = -200;

        console.log(`📂 Traitement du fichier ${fileName} pour l'année ${YEAR_IMPORT}...`);

        let countAdded = 0;
        let countSkipped = 0;

        for (const feature of jsonData.features) {
            // Récupère le nom dans le GeoJSON (souvent properties.name ou properties.NAME ou properties.Label)
            const geoJsonName = feature.properties.name || feature.properties.NAME || feature.properties.Label;

            // --- FILTRE : On vérifie si ce nom est dans notre liste TARGET_CIVS ---
            if (!TARGET_CIVS[geoJsonName]) {
                countSkipped++;
                continue; // On passe au suivant, on ne l'importe pas
            }

            const config = TARGET_CIVS[geoJsonName];

            // A. Trouver ou Créer l'Entité (Si elle existe déjà, on ne la recrée pas)
            // On utilise le displayName si fourni, sinon le nom du GeoJSON
            const finalName = config.displayName || geoJsonName;

            let entity = await Entity.findOne({ name: finalName });

            if (!entity) {
                entity = await Entity.create({
                    name: finalName,
                    type: config.type,
                    primaryColor: config.color
                });
                console.log(`✨ Entité créée : ${finalName}`);
            }

            // B. Créer le Snapshot (La forme géographique pour CETTE année)
            // On vérifie d'abord s'il existe déjà pour éviter les doublons si tu relances le script
            const existingSnapshot = await EntitySnapshot.findOne({ entityId: entity._id, year: YEAR_IMPORT });

            if (!existingSnapshot) {
                await EntitySnapshot.create({
                    entityId: entity._id,
                    year: YEAR_IMPORT,
                    geometry: feature.geometry
                });
                countAdded++;
            } else {
                console.log(`  -> Snapshot déjà existant pour ${finalName} en ${YEAR_IMPORT}`);
            }
        }

        console.log(`--------------------------------------------------`);
        console.log(`✅ Terminé !`);
        console.log(`➕ Ajoutés : ${countAdded}`);
        console.log(`🗑️ Ignorés : ${countSkipped} (car absents de la config TARGET_CIVS)`);

        process.exit();

    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
};

seedData();