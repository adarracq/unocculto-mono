import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

export const functions = {
    getIconSource,
    getAvatarSource,
    convertImageToBase64,
    dateToString,
    simpleDateToString,
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
        case 'arrow-right':
            return require('@/app/assets/icons/arrow-right.png');
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
        case 'globe':
            return require('@/app/assets/icons/globe.png');
        case 'paper_map':
            return require('@/app/assets/icons/paper_map.png');
        case 'close':
            return require('@/app/assets/icons/close.png');
        case 'lightning':
            return require('@/app/assets/icons/lightning.png');
        case 'coin':
            return require('@/app/assets/icons/coin.png');
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

function dateToString(date: number) {
    // exemple : -13800000000 -> Il y a 13,8 milliards d'années
    //12000000 -> Il y a 12 millions d'années
    //450000 -> Il y a 450 mille ans
    //-2600 -> 2600 avant J.-C.
    //724 -> 724 après J.-C.
    // 20231224 -> 24 Décembre 2023
    if (date < -1000000000) {
        if (date % 1000000000 === 0) {
            return `Il y a ${(-date / 1000000000).toFixed(0)} milliards d'années`;
        }
        return `Il y a ${(-date / 1000000000).toFixed(1)} milliards d'années`;
    }
    else if (date < -1000000) {
        if (date % 1000000 === 0) {
            return `Il y a ${(-date / 1000000).toFixed(0)} millions d'années`;
        }
        return `Il y a ${(-date / 1000000).toFixed(1)} millions d'années`;
    }
    else if (date < -1000) {
        return `Il y a ${(-date / 1000).toFixed(0)} mille ans`;
    }
    else if (date < 0) {
        return `${-date} avant J.-C.`;
    }
    else if (date < 10000) {
        return `${date} après J.-C.`;
    }
    else {
        const dateStr = date.toString();
        const year = dateStr.slice(0, 4);
        const month = dateStr.slice(4, 6);
        const day = dateStr.slice(6, 8);
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
    }
}

function simpleDateToString(date: number) {
    // exemple : -13800000000 -> 13,8 Md 
    //12000000 -> 12 M
    //450000 -> 450 k
    //-2600 -> 2600 av. J.-C.
    //724 -> 724
    // 20231224 -> 24/12/2023
    if (date < -1000000000) {
        return `${(-date / 1000000000).toFixed(1)} Md`;
    }
    else if (date < -1000000) {
        return `${(-date / 1000000).toFixed(1)} M`;
    }
    else if (date < -1000) {
        return `${(-date / 1000).toFixed(1)} k`;
    }
    else if (date < 0) {
        return `${-date} av. J.-C.`;
    }
    else if (date < 10000) {
        return `${date}`;
    }
    else {
        const dateStr = date.toString();
        const year = dateStr.slice(0, 4);
        const month = dateStr.slice(4, 6);
        const day = dateStr.slice(6, 8);
        return `${day}/${month}/${year}`;
    }
}