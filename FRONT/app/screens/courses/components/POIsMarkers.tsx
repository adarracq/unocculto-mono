import Colors from '@/app/constants/Colors';
import { CourseThemesContext } from '@/app/contexts/CourseThemesContext';
import POI from '@/app/models/POI';
import Theme from '@/app/models/Theme';
import Mapbox from '@rnmapbox/maps';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

// --- CONFIGURATION ---
const TARGET_ICON_SIZE = 30; // Taille de base de l'icône (en pixels)
const ACTIVE_ICON_SCALE_FACTOR = 1.3; // Facteur de grossissement pour l'animation (ex: +30%)

const ICONS = {
    'history_politics': require('@/app/assets/other/taj-mahal.png'),
    'science_technology': require('@/app/assets/other/science.png'),
    'arts_culture': require('@/app/assets/other/art.png'),
    'literature_philosophy': require('@/app/assets/other/philosopher.png'),
    'society_religion': require('@/app/assets/other/religions.png'),
    'geography_nature': require('@/app/assets/other/volcano.png'),
    'sports_leisure': require('@/app/assets/other/torch.png'),
    'geopolitics_economy': require('@/app/assets/other/geopolitics.png'),
    'default': require('@/app/assets/other/science.png'),
};

type Props = {
    visiblePOIs: POI[];
    selectedPoi: POI | null;
    onSelectPoi: (poi: POI) => void;
    isChapterCompleted: boolean;
}

export default function POIsMarkers({ visiblePOIs, selectedPoi, onSelectPoi, isChapterCompleted }: Props) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [courseThemesContext] = useContext(CourseThemesContext);

    // Animation timer (pulsation)
    useEffect(() => {
        const interval = setInterval(() => {
            setIsExpanded(prev => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const activeItem = isChapterCompleted ? null : (visiblePOIs.length > 0 ? visiblePOIs[visiblePOIs.length - 1] : null);
    const completedItems = isChapterCompleted ? visiblePOIs : visiblePOIs.slice(0, visiblePOIs.length - 1);

    // --- HELPER : Calculer le ratio pour avoir une taille fixe en pixels ---
    const getScaleForIcon = (iconKey: string, targetSize: number): number => {
        const asset = ICONS[iconKey as keyof typeof ICONS];
        if (!asset) return 1;
        const { width } = Image.resolveAssetSource(asset);
        // Ex: target 40px / image 200px = scale 0.2
        return targetSize / width;
    };

    // --- HELPER : Trouver la clé de l'icone et son scale pour un POI donné ---
    const getIconProperties = (poi: POI) => {
        let iconKey = 'default';
        if (poi.themes && poi.themes.length > 0) {
            const mainThemeID = poi.themes[0];
            const theme = courseThemesContext?.find((t: Theme) => t._id === mainThemeID);
            if (theme && ICONS[theme.name as keyof typeof ICONS]) {
                iconKey = theme.name;
            }
        }
        const iconScale = getScaleForIcon(iconKey, TARGET_ICON_SIZE);
        return { iconKey, iconScale };
    };

    // 1. GEOJSON DES COMPLÉTÉS
    const completedPoisGeoJSON = useMemo(() => {
        if (completedItems.length === 0) return null;
        return {
            type: 'FeatureCollection',
            features: completedItems.map((poi) => {
                const { iconKey, iconScale } = getIconProperties(poi);
                return {
                    type: 'Feature',
                    properties: {
                        name: poi.name,
                        isSelected: selectedPoi?.name === poi.name,
                        iconName: iconKey,
                        iconScale: iconScale,
                    },
                    geometry: { type: 'Point', coordinates: poi.location.coordinates },
                };
            }),
        };
    }, [completedItems, selectedPoi, courseThemesContext]);

    // 2. GEOJSON DU POI ACTIF (Avec les propriétés d'icone maintenant !)
    const activePointGeoJSON = useMemo(() => {
        if (!activeItem) return null;

        const { iconKey, iconScale } = getIconProperties(activeItem);

        return {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {
                    name: activeItem.name,
                    iconName: iconKey,
                    iconScale: iconScale
                },
                geometry: { type: 'Point', coordinates: activeItem.location.coordinates },
            }],
        };
    }, [activeItem, courseThemesContext]);


    return (
        <>
            <Mapbox.Images images={ICONS} />

            {/* ================================================= */}
            {/* 1. RENDU DES POIS COMPLÉTÉS                       */}
            {/* ================================================= */}
            {completedPoisGeoJSON && (
                <Mapbox.ShapeSource
                    id="completed-pois-source"
                    shape={completedPoisGeoJSON as any}
                    onPress={(event) => {
                        const feature = event.features[0];
                        if (feature?.properties?.name) {
                            const poi = completedItems.find(p => p.name === feature.properties!.name);
                            if (poi) onSelectPoi(poi);
                        }
                    }}
                >
                    {/* Fond blanc */}
                    <Mapbox.CircleLayer
                        id="completed-pois-base"
                        style={{
                            circleColor: Colors.white,
                            circleRadius: (TARGET_ICON_SIZE / 2) + 4,
                            circleStrokeColor: Colors.lightGrey,
                            circleStrokeWidth: 1,
                        }}
                    />
                    {/* Icone */}
                    <Mapbox.SymbolLayer
                        id="completed-icon-layer"
                        style={{
                            iconImage: ['get', 'iconName'],
                            iconSize: ['get', 'iconScale'],
                            iconAllowOverlap: true,
                            iconIgnorePlacement: true,
                        }}
                    />
                    {/* Sélection */}
                    <Mapbox.CircleLayer
                        id="completed-pois-selected"
                        filter={['==', ['get', 'isSelected'], true]}
                        style={{
                            circleColor: 'transparent',
                            circleRadius: (TARGET_ICON_SIZE / 2) + 4,
                            circleStrokeColor: Colors.main,
                            circleStrokeWidth: 3,
                        }}
                    />
                </Mapbox.ShapeSource>
            )}

            {/* ================================================= */}
            {/* 2. RENDU DU POI ACTIF (ANIMÉ)                     */}
            {/* ================================================= */}
            {activeItem && activePointGeoJSON && (
                <Mapbox.ShapeSource
                    id="active-poi-source"
                    shape={activePointGeoJSON as any}
                    onPress={() => onSelectPoi(activeItem)}
                >
                    {/* A. Cercle Blanc Extérieur (Pulsation) */}
                    <Mapbox.CircleLayer
                        id="active-poi-outer"
                        style={{
                            circleColor: Colors.main,
                            // Rayon basé sur la taille de l'icone + marge + expansion
                            circleRadius: isExpanded ? (TARGET_ICON_SIZE / 2) + 12 : (TARGET_ICON_SIZE / 2),
                            circleOpacity: 1,
                            circleRadiusTransition: { duration: 1500, delay: 0 }
                        }}
                    />

                    {/* B. Cercle Couleur Intérieur (Fond de l'icone) */}
                    <Mapbox.CircleLayer
                        id="active-poi-inner"
                        style={{
                            circleColor: Colors.white, // Couleur principale
                            circleRadius: isExpanded ? (TARGET_ICON_SIZE / 2) : (TARGET_ICON_SIZE / 2) + 8,
                            circleRadiusTransition: { duration: 1500, delay: 0 },
                        }}
                    />

                    {/* C. L'Icone Animée */}
                    <Mapbox.SymbolLayer
                        id="active-poi-icon"
                        style={{
                            iconImage: ['get', 'iconName'],
                            // EXPLICATION MATHÉMATIQUE :
                            iconSize: ['get', 'iconScale'],
                            iconAllowOverlap: true,
                            iconIgnorePlacement: true,
                        }}
                    />
                </Mapbox.ShapeSource>
            )}
        </>
    );
}

const styles = StyleSheet.create({});