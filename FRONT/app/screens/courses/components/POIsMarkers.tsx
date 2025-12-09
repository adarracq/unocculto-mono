import Colors from '@/app/constants/Colors';
import POI from '@/app/models/POI'; // Assure-toi que le chemin est bon
import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    visiblePOIs: POI[]; // La liste des POIs à afficher
    selectedPoi: POI | null;                         // Le POI actuellement sélectionné
    onSelectPoi: (poi: POI) => void;                 // Callback quand on clique
    isChapterCompleted: boolean;               // Indique si le chapitre est complété
}

export default function POIsMarkers({ visiblePOIs, selectedPoi, onSelectPoi, isChapterCompleted }: Props) {

    // --- GESTION DE L'ANIMATION DU MARKER ACTIF ---
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsExpanded(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // On sépare le POI actif (le dernier) des POIs terminés
    const activeItem = isChapterCompleted ? null : (visiblePOIs.length > 0 ? visiblePOIs[visiblePOIs.length - 1] : null);
    const completedItems = isChapterCompleted ? visiblePOIs : visiblePOIs.slice(0, visiblePOIs.length - 1);

    // Préparation du GeoJSON pour le marker actif (uniquement s'il existe)
    const activePointGeoJSON = activeItem ? {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: activeItem.location.coordinates,
            },
        }],
    } : null;

    return (
        <>
            {/* ================================================= */}
            {/* 1. RENDU DES POIS COMPLÉTÉS (PointAnnotation)     */}
            {/* ================================================= */}
            {completedItems.map((item) => {
                const isSelected = selectedPoi?.name === item.name;

                return (
                    <Mapbox.PointAnnotation
                        // La clé dynamique force le re-render Mapbox lors de la sélection
                        key={`completed-${item.name}-${isSelected ? 'selected' : 'normal'}`}
                        id={item.name}
                        coordinate={item.location.coordinates}
                        onSelected={() => onSelectPoi(item)}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={[
                            styles.hitBoxContainer,
                            { zIndex: isSelected ? 999 : 1 }
                        ]}>
                            <View style={[
                                styles.markerCompletedDot,
                                isSelected && {
                                    transform: [{ scale: 2.5 }],
                                    borderColor: Colors.main,
                                    borderWidth: 2,
                                    backgroundColor: Colors.white
                                }
                            ]} />
                        </View>
                    </Mapbox.PointAnnotation>
                );
            })}

            {/* ================================================= */}
            {/* 2. RENDU DU POI ACTIF (Layers + Click Zone)       */}
            {/* ================================================= */}
            {activeItem && activePointGeoJSON && (
                <>
                    {/* A. L'animation visuelle (ShapeSource + Layers) */}
                    <Mapbox.ShapeSource id="active-poi-source" shape={activePointGeoJSON as any}>
                        {/* Cercle Blanc Extérieur */}
                        <Mapbox.CircleLayer
                            id="active-poi-outer"
                            style={{
                                circleColor: Colors.white,
                                circleRadius: isExpanded ? 18 : 8,
                                circleRadiusTransition: { duration: 2000, delay: 0 }
                            }}
                        />
                        {/* Cercle Couleur Intérieur */}
                        <Mapbox.CircleLayer
                            id="active-poi-inner"
                            style={{
                                circleColor: Colors.main,
                                circleRadius: isExpanded ? 15 : 5,
                                circleRadiusTransition: { duration: 2000, delay: 0 }
                            }}
                        />
                    </Mapbox.ShapeSource>

                    {/* B. La zone de clic invisible (PointAnnotation) */}
                    <Mapbox.PointAnnotation
                        id="active-poi-click-zone"
                        coordinate={activeItem.location.coordinates}
                        onSelected={() => onSelectPoi(activeItem)}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        <View style={styles.hitBoxContainer}>
                            <Text></Text>
                        </View>
                    </Mapbox.PointAnnotation>
                </>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    // Zone de clic invisible (60x60)
    hitBoxContainer: {
        width: 60,
        height: 60,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    // Point visuel statique
    markerCompletedDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderWidth: 1,
        borderColor: '#000',
    },
});