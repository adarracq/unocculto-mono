import BodyText from '@/app/components/atoms/BodyText';
import Colors from '@/app/constants/Colors';
import POI from '@/app/models/POI';
import POIInfoCard from '@/app/screens/courses/components/POIInfoCard';
import POIsMarkers from '@/app/screens/courses/components/POIsMarkers';
import Mapbox from '@rnmapbox/maps';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

Mapbox.setAccessToken('pk.eyJ1IjoiYW50b2luZWNkIiwiYSI6ImNtaW9hZXRvZTB6Mncza3NidTNqaGhscjkifQ.q-BKGDUHJBBCNL5nf2ftOQ');

type Props = {
    pois: POI[];
    currentIndex: number;
    onNavigateToCourse: (poi: POI) => void;
    onSelectPOI: (poi: POI) => void;
}

export default function MapCourse(props: Props) {
    const [isGlobe, setIsGlobe] = useState(true);
    const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

    // On affiche tout les POIs
    const visiblePOIs = props.pois;

    // Gestion de la caméra
    const cameraCenter = useMemo(() => {
        if (selectedPoi) return selectedPoi.location.coordinates;
        if (visiblePOIs.length > 0) return visiblePOIs[0].location.coordinates;
        return [-155.5828, 19.8968]; // Hawaii (Théia Impact) par défaut
    }, [selectedPoi, visiblePOIs]);


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
                            color: '#00A9CC',
                            highColor: '#004488',
                            spaceColor: Colors.realBlack,
                            starIntensity: 2,
                        }}
                    />
                )}

                <POIsMarkers
                    visiblePOIs={visiblePOIs}
                    selectedPoi={selectedPoi}
                    onSelectPoi={(poi) => {
                        setSelectedPoi(poi)
                        props.onSelectPOI(poi);
                    }}
                    isChapterCompleted={true}
                />
            </Mapbox.MapView>

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
            <View style={styles.switch}>
                <BodyText text={isGlobe ? 'Globe' : 'Mercator'} />
                <Switch value={isGlobe} onValueChange={setIsGlobe} />
            </View>
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
    switch: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
        borderCurve: 'continuous',
        flexDirection: 'row',
        gap: 10
    }
});