import Button from '@/app/components/atoms/Button';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import POI from '@/app/models/POI';
import POIInfoCard from '@/app/screens/courses/components/POIInfoCard';
import POIsMarkers from '@/app/screens/courses/components/POIsMarkers';
import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

Mapbox.setAccessToken('pk.eyJ1IjoiYW50b2luZWNkIiwiYSI6ImNtaW9hZXRvZTB6Mncza3NidTNqaGhscjkifQ.q-BKGDUHJBBCNL5nf2ftOQ');

type Props = {
    pois: POI[];
    currentIndex: number;
    isChapterCompleted: boolean;
    onNavigateToCourse: (poi: POI) => void;
    onSelectPOI: (poi: POI) => void;
    onChapterCompleted: () => void;
}

const WORLD_COVER_GEOJSON = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [[[-180, 90], [180, 90], [180, -90], [-180, -90], [-180, 90]]],
        },
    }],
};

export default function MapChapter0(props: Props) {
    const [isGlobe, setIsGlobe] = useState(true);
    const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
    const [animationStarted, setAnimationStarted] = useState(false);

    // Synchroniser animationStarted avec currentIndex
    useEffect(() => {
        if (props.currentIndex > 0) {
            setAnimationStarted(true);
        }
    }, [props.currentIndex]);

    // --- SCENES ---
    const scene = useMemo(() => {
        const scenes = [
            {   // 0. NÉANT (avant de cliquer sur Big Bang)
                spaceColor: '#000000', atmosphereColor: '#000000', highColor: '#000000',
                starIntensity: 0, coverColor: '#000000', coverOpacity: 1, horizonBlend: .05
            },
            {   // 1. BIG BANG (après avoir cliqué sur Big Bang, avant d'avoir complété le POI)
                spaceColor: '#FFFFFF', atmosphereColor: '#FFFFFF', highColor: '#FFFFFF',
                starIntensity: 0, coverColor: '#FFFFFF', coverOpacity: 1, horizonBlend: .05
            },
            {   // 2. PREMIÈRE LUMIÈRE (après avoir complété le POI Big Bang) - univers transparent
                spaceColor: '#000000', atmosphereColor: '#000000', highColor: '#000020',
                starIntensity: 0.8, coverColor: '#000000', coverOpacity: 1, horizonBlend: .05,
            },
            {   // 3. FORMATION SYSTÈME SOLAIRE (après avoir complété le POI Première Lumière)
                spaceColor: '#2b0a00', atmosphereColor: '#ff4500', highColor: '#1a0500',
                starIntensity: 1, coverColor: '#ff4500', coverOpacity: 1, horizonBlend: .1,
            },
            {   // 4. SYSTÈME SOLAIRE FORMÉ (après avoir complété le POI Système Solaire)
                spaceColor: '#2b0a00', atmosphereColor: '#f9B320', highColor: '#1a0500',
                starIntensity: 2, coverColor: '#f9B320', coverOpacity: 1, horizonBlend: .2,
            },
        ];

        // Logique de progression :
        // - Avant animation : scène 0 (néant)
        // - Animation commencée mais aucun POI complété : scène 1 (big bang)
        // - POI complétés : scène index + 2
        let sceneIndex = 0;
        if (animationStarted) {
            sceneIndex = 1 + props.currentIndex; // 1 + nombre de POIs complétés
        }

        return scenes[Math.min(sceneIndex, scenes.length - 1)];
    }, [props.currentIndex, animationStarted]);

    // On affiche tous les POI jusqu'à l'index actuel + 1, ou le premier POI si l'animation a commencé
    const visiblePOIs = animationStarted && props.currentIndex === 0
        ? props.pois.slice(0, 1)
        : props.pois.slice(0, props.currentIndex + 1);

    const currentDuration = (props.currentIndex === 0 && !animationStarted) ? 0 : 2000;

    const cameraCenter = useMemo(() => {
        if (selectedPoi) return selectedPoi.location.coordinates;
        if (visiblePOIs.length > 0) return visiblePOIs[visiblePOIs.length - 1].location.coordinates;
        return [-118.0617, 34.2233];
    }, [selectedPoi, visiblePOIs]);

    const handleBigBangClick = () => {
        // Juste déclencher l'animation vers l'étape 1
        setAnimationStarted(true);
    };

    const handleChapterCompleted = () => {
        props.onChapterCompleted();
    }

    return props.pois.length > 0 && (
        <View style={styles.page}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={'mapbox://styles/antoinecd/cmiog0v9w000a01r0aya571gu'}
                logoEnabled={false}
                projection={isGlobe ? 'globe' : 'mercator'}
                pitchEnabled={false}
                rotateEnabled={false}
                onPress={() => setSelectedPoi(null)}
            >
                <Mapbox.Camera
                    zoomLevel={selectedPoi ? 1 : 1.1}
                    centerCoordinate={cameraCenter}
                    animationDuration={2000}
                />

                {isGlobe && (
                    <Mapbox.Atmosphere
                        style={{
                            color: scene.atmosphereColor,
                            highColor: scene.highColor,
                            spaceColor: scene.spaceColor,
                            starIntensity: scene.starIntensity,
                            horizonBlend: scene.horizonBlend,
                            colorTransition: { duration: currentDuration, delay: 0 },
                            highColorTransition: { duration: currentDuration, delay: 0 },
                            spaceColorTransition: { duration: currentDuration, delay: 0 },
                            starIntensityTransition: { duration: currentDuration, delay: 0 },
                        }}
                    />
                )}

                <Mapbox.ShapeSource id="worldCoverSource" shape={WORLD_COVER_GEOJSON as any}>
                    <Mapbox.FillLayer
                        id="worldCoverFill"
                        style={{
                            fillColor: scene.coverColor,
                            fillOpacity: scene.coverOpacity,
                            fillColorTransition: { duration: currentDuration, delay: 0 },
                            fillOpacityTransition: { duration: currentDuration, delay: 0 },
                        }}
                    />
                </Mapbox.ShapeSource>

                <POIsMarkers
                    visiblePOIs={visiblePOIs}
                    selectedPoi={selectedPoi}
                    onSelectPoi={(poi) => {
                        setSelectedPoi(poi)
                        props.onSelectPOI(poi);
                    }}
                    isChapterCompleted={props.isChapterCompleted}
                />
            </Mapbox.MapView>

            {/* --- ETAPE 0 : BOUTON BIG BANG --- */}
            {props.currentIndex === 0 && !animationStarted && (
                <View style={styles.bigBangContainer}>
                    <Button
                        title="Le Big Bang"
                        backgroundColor={Colors.main}
                        textColor={Colors.white}
                        style={{ width: 200 }}
                        onPress={handleBigBangClick}
                    />
                </View>
            )}

            {/* --- MESSAGE DE RÉUSSITE --- */}
            {props.isChapterCompleted && (
                <View style={styles.successContainer}>
                    <Title1 title=" Chapitre terminé !" color={Colors.white} />
                    <Button
                        title="Chapitre suivant"
                        backgroundColor={Colors.main}
                        textColor={Colors.white}
                        onPress={handleChapterCompleted}
                    />
                </View>
            )}

            {/* --- INFO CARD --- */}
            {selectedPoi && (
                <POIInfoCard
                    selectedPoi={selectedPoi}
                    onNavigateToCourse={(poi) => {
                        props.onNavigateToCourse(poi);
                        setSelectedPoi(null);
                    }}
                    onClose={() => setSelectedPoi(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#000' },
    map: { flex: 1, marginVertical: -35 },
    bigBangContainer: {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    successContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: Colors.black + 'DD',
        borderRadius: 16,
        borderCurve: 'continuous',
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.darkGrey,
        alignItems: 'center',
        gap: 15,
    },
});