import Button from '@/app/components/atoms/Button';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import POI from '@/app/models/POI';
import POIInfoCard from '@/app/screens/courses/components/POIInfoCard';
import POIsMarkers from '@/app/screens/courses/components/POIsMarkers';
import Mapbox from '@rnmapbox/maps';
import React, { useMemo, useState } from 'react';
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

// Un polygone couvrant le monde entier pour teinter la carte (Magma, Océan, etc.)
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

export default function MapChapter1(props: Props) {
    const [isGlobe, setIsGlobe] = useState(true);
    const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

    // --- SCENES VISUELLES (Basées sur l'histoire de la Terre) ---
    const scene = useMemo(() => {
        const scenes = [
            {   // SCÈNE 0 : IMPACT DE THÉIA (Terre en fusion)
                // Ambiance : Magma, rouge intense, chaleur extrême.
                atmosphereColor: '#ff2a00',
                highColor: '#ffaa00',
                spaceColor: '#000000',
                starIntensity: 1,
                coverColor: '#aa2200', // Teinte le sol en rouge lave
                coverOpacity: 1
            },
            {   // SCÈNE 1 : REFROIDISSEMENT & ZIRCONS (Croûte solide)
                // Ambiance : Roche sombre, vapeur, terre stérile mais solide.
                atmosphereColor: '#a0a0a0', // Gris vapeur
                highColor: '#ffffff',
                spaceColor: '#050505',
                starIntensity: 1,
                coverColor: '#3b2f2f', // Marron/Gris foncé (Roche)
                coverOpacity: 1
            },
            {   // SCÈNE 2 : TERRE PRIMITIVE (Après le chapitre)
                // Ambiance : Début des océans, atmosphère plus calme.
                atmosphereColor: 'rgba(50, 150, 255, 0.4)',
                highColor: '#000020',
                spaceColor: '#000000',
                starIntensity: 1,
                coverColor: '#004488', // Bleu profond (Océans primitifs)
                coverOpacity: 1
            }
        ];

        // Logique de progression :
        // Si chapitre terminé -> Scène finale (Océans)
        // Sinon -> Scène correspondant à l'index du POI en cours
        if (props.isChapterCompleted) return scenes[2];

        // On s'assure de ne pas dépasser le tableau
        const index = Math.min(props.currentIndex, scenes.length - 1);
        return scenes[index];
    }, [props.currentIndex, props.isChapterCompleted]);

    // On affiche les POI jusqu'à l'index actuel + 1
    const visiblePOIs = props.pois.slice(0, props.currentIndex + 1);
    const currentDuration = 3000; // Transition lente pour l'évolution géologique

    // Gestion de la caméra
    const cameraCenter = useMemo(() => {
        if (selectedPoi) return selectedPoi.location.coordinates;
        // Si aucun POI sélectionné, on centre sur le dernier POI visible (ou le premier par défaut)
        if (visiblePOIs.length > 0) return visiblePOIs[visiblePOIs.length - 1].location.coordinates;
        return [-155.5828, 19.8968]; // Hawaii (Théia Impact) par défaut
    }, [selectedPoi, visiblePOIs]);

    const handleChapterCompleted = () => {
        props.onChapterCompleted();
    }

    return props.pois.length > 0 && (
        <View style={styles.page}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={'mapbox://styles/antoinecd/cmiog0v9w000a01r0aya571gu'} // Style sombre/satellite
                logoEnabled={false}
                projection={isGlobe ? 'globe' : 'mercator'}
                pitchEnabled={false}
                rotateEnabled={false}
                onPress={() => setSelectedPoi(null)}
            >
                <Mapbox.Camera
                    zoomLevel={selectedPoi ? 1.5 : 1}
                    centerCoordinate={cameraCenter}
                    animationDuration={2500}
                />

                {isGlobe && (
                    <Mapbox.Atmosphere
                        style={{
                            color: scene.atmosphereColor,
                            highColor: scene.highColor,
                            spaceColor: scene.spaceColor,
                            starIntensity: scene.starIntensity,
                            horizonBlend: 0.4,
                            // Transitions fluides entre les ères géologiques
                            colorTransition: { duration: currentDuration, delay: 0 },
                            highColorTransition: { duration: currentDuration, delay: 0 },
                            spaceColorTransition: { duration: currentDuration, delay: 0 },
                            starIntensityTransition: { duration: currentDuration, delay: 0 },
                        }}
                    />
                )}

                {/* Layer pour colorer la surface (Magma -> Roche -> Eau) */}
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

            {/* --- MESSAGE DE RÉUSSITE --- */}
            {props.isChapterCompleted && (
                <View style={styles.successContainer}>
                    <Title1 title="Terre formée !" color={Colors.white} />
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
    successContainer: {
        position: 'absolute',
        top: 60, // Un peu plus bas pour ne pas gêner
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});