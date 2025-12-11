import Button from '@/app/components/atoms/Button';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import { useApi } from '@/app/hooks/useApi';
import EntitySnapshot from '@/app/models/EntitySnapshot';
import POI from '@/app/models/POI';
import POIInfoCard from '@/app/screens/courses/components/POIInfoCard';
import POIsMarkers from '@/app/screens/courses/components/POIsMarkers';
import { entitySnapshotService } from '@/app/services/entitySnapshot.service';
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

export default function MapChapters(props: Props) {
    const [isGlobe, setIsGlobe] = useState(true);
    const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
    const [entitySnapshots, setEntitySnapshots] = useState<EntitySnapshot[]>([]);
    const [filterSnapshots, setFilterSnapshots] = useState<EntitySnapshot[]>([]);

    const { execute: getEntitySnapshots, loading: loadingEntitySnapshots } = useApi(
        () => entitySnapshotService.getAll(),
        'SetThemesScreen - getChapters'
    );

    const fetchEntitiesSnapshots = async () => {
        const entitiesSnapshotsFromApi = await getEntitySnapshots();
        setEntitySnapshots(entitiesSnapshotsFromApi || []);
        setFilterSnapshots(entitiesSnapshotsFromApi.filter((es: any) => es.year == -10000));
    };

    // On affiche les POI jusqu'à l'index actuel + 1
    const visiblePOIs = props.pois.slice(0, props.currentIndex + 1);
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

    useEffect(() => {
        fetchEntitiesSnapshots();
    }, []);

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

                {/* Toutes les snapshots */}
                {
                    filterSnapshots.map((snapshot, index) => (
                        <Mapbox.ShapeSource
                            key={`snapshot-${index}`}
                            id={`snapshot-${index}`}
                            shape={snapshot.geometry as any}
                            onPress={() => {
                                console.log('Snapshot pressed:', snapshot.entityId.name);
                            }}
                        >
                            <Mapbox.FillLayer
                                id={`snapshotFill-${index}`}
                                style={{
                                    fillColor: Colors.white,
                                    fillOpacity: 1,
                                }}
                            />
                            <Mapbox.LineLayer
                                id={`snapshotLine-${index}`}
                                style={{
                                    lineColor: Colors.main,
                                    lineWidth: 2,
                                    lineOpacity: 1,
                                }}
                            />
                        </Mapbox.ShapeSource>
                    ))
                }

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