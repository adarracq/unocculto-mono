const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// On ajoute 'glb' et 'gltf' aux extensions reconnues comme assets (images, sons...)
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;