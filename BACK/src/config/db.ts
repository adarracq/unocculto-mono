// src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        // On récupère l'URL de connexion depuis les variables d'environnement
        const conn = await mongoose.connect(process.env.MONGO_URI || '');

        console.log(`✅ MongoDB Connecté: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`❌ Erreur de connexion: ${error.message}`);
        } else {
            console.error(`❌ Erreur inconnue de connexion`);
        }
        process.exit(1); // Arrête le serveur si la BDD ne répond pas
    }
};

export default connectDB;