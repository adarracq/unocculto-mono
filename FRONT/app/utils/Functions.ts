import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

export const functions = {
    getIconSource,
    getAvatarSource,
    convertImageToBase64,
}

function getIconSource(name: string) {
    switch (name) {
        case 'profile':
            return require('@/app/assets/icons/profile.png');
        case 'cards':
            return require('@/app/assets/icons/cards.png');
        case 'duel':
            return require('@/app/assets/icons/duel.png');
        case 'books':
            return require('@/app/assets/icons/books.png');
        case 'mail':
            return require('@/app/assets/icons/mail.png');
        case 'arrow-left':
            return require('@/app/assets/icons/arrow-left.png');
        case 'king':
            return require('@/app/assets/icons/king.png');
        case 'student':
            return require('@/app/assets/icons/student.png');
        case 'compass':
            return require('@/app/assets/icons/compass.png');
        case 'fire':
            return require('@/app/assets/icons/fire.png');
        case 'gem':
            return require('@/app/assets/icons/gem.png');
        case 'change':
            return require('@/app/assets/icons/change.png');
        case 'lock':
            return require('@/app/assets/icons/lock.png');
        case 'check':
            return require('@/app/assets/icons/check.png');
        case 'journey':
            return require('@/app/assets/icons/journey.png');
        case 'rocket':
            return require('@/app/assets/icons/rocket.png');
        default:
            return require('@/app/assets/icons/none.png');
    }
}

function getAvatarSource(name: string) {
    switch (name) {
        case 'stars':
            return require('@/app/assets/avatars/stars.png');
        case 'dinosaur':
            return require('@/app/assets/avatars/dinosaur.png');
        case 'egyptian':
            return require('@/app/assets/avatars/egyptian.png');
        case 'inca':
            return require('@/app/assets/avatars/inca.png');
        case 'king':
            return require('@/app/assets/avatars/king.png');
        case 'philosopher':
            return require('@/app/assets/avatars/philosopher.png');
        case 'prehistoric':
            return require('@/app/assets/avatars/prehistoric.png');
        case 'queen':
            return require('@/app/assets/avatars/queen.png');
        case 'roman':
            return require('@/app/assets/avatars/roman.png');
        case 'samurai':
            return require('@/app/assets/avatars/samurai.png');
        case 'viking':
            return require('@/app/assets/avatars/viking.png');
        case 'geisha':
            return require('@/app/assets/avatars/geisha.png');
        default:
            return require('@/app/assets/avatars/stars.png');
    }
}



async function convertImageToBase64(imageSource: any) {
    try {
        // 1. Charger l'asset (résout le require('./...'))
        const asset = Asset.fromModule(imageSource);

        // 2. S'assurer que le fichier est téléchargé/copié dans le cache local du téléphone
        // C'est l'étape cruciale qui transforme le "projet" en "fichier réel"
        await asset.downloadAsync();

        // 3. Lire le fichier depuis le chemin local réel (file://...)
        // asset.localUri est le chemin que FileSystem peut lire
        if (!asset.localUri) {
            throw new Error("Impossible de récupérer l'URI local de l'image");
        }

        const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
            encoding: 'base64',
        });

        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.error("Erreur conversion image:", error);
        return '';
    }
};