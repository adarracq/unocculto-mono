import Button from '@/app/components/atoms/Button';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import SnapshotYears from '@/app/constants/SnapshotYears';
import { useApi } from '@/app/hooks/useApi';
import Entity from '@/app/models/Entity';
import EntitySnapshot from '@/app/models/EntitySnapshot';
import POI from '@/app/models/POI';
import POIInfoCard from '@/app/screens/courses/components/POIInfoCard';
import POIsMarkers from '@/app/screens/courses/components/POIsMarkers';
import { entitySnapshotService } from '@/app/services/entitySnapshot.service';
import { functions } from '@/app/utils/Functions';
import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import EntitiesMarkers from './EntitiesMarker';
import EntityInfoCard from './EntityInfoCard';

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
    const [showEntities, setShowEntities] = useState(false);
    const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const [entitySnapshots, setEntitySnapshots] = useState<EntitySnapshot[]>([]);
    const [filterSnapshots, setFilterSnapshots] = useState<EntitySnapshot[]>([]);

    const { execute: getEntitySnapshots } = useApi(
        () => entitySnapshotService.getAll(),
        'SetThemesScreen - getChapters'
    );

    const fetchEntitiesSnapshots = async () => {
        const entitiesSnapshotsFromApi = await getEntitySnapshots();
        setEntitySnapshots(entitiesSnapshotsFromApi || []);
    };

    const updateFilteredSnapshots = () => {
        let newYear = -200000;
        if (selectedPoi) {
            newYear = selectedPoi.dateStart;
        } else if (props.isChapterCompleted) {
            newYear = props.pois[props.pois.length - 1]?.dateStart;
        }
        else {
            newYear = props.pois[props.currentIndex]?.dateStart;
        }

        let lastSnapshotYear = 11;
        for (let year of SnapshotYears.snapshots) {
            if (year <= newYear) {
                lastSnapshotYear = year;
            } else {
                break;
            }
        }

        const filtered = entitySnapshots.filter(es => es.year === lastSnapshotYear);
        setFilterSnapshots(filtered);
    };

    const visiblePOIs = props.pois.slice(0, props.currentIndex + 1);

    const cameraCenter = useMemo(() => {
        if (selectedPoi) return selectedPoi.location.coordinates;
        if (visiblePOIs.length > 0) return visiblePOIs[visiblePOIs.length - 1].location.coordinates;
        return [-155.5828, 19.8968];
    }, [selectedPoi, visiblePOIs]);

    const handleChapterCompleted = () => {
        props.onChapterCompleted();
    }

    // Gestion du clic sur une entité (passé au composant enfant)
    const handleSelectEntity = (entity: Entity) => {
        setSelectedEntity(entity);
        setSelectedPoi(null);
    };

    useEffect(() => {
        fetchEntitiesSnapshots();
    }, []);

    useEffect(() => {
        updateFilteredSnapshots();
    }, [selectedPoi, props.currentIndex, entitySnapshots]);


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

                {/* --- ENTITIES --- */}
                <EntitiesMarkers
                    snapshots={filterSnapshots}
                    isVisible={showEntities}
                    onSelectEntity={handleSelectEntity}
                />
                {/* --- POIS --- */}
                <POIsMarkers
                    visiblePOIs={visiblePOIs}
                    selectedPoi={selectedPoi}
                    onSelectPoi={(poi) => {
                        setSelectedPoi(poi)
                        setSelectedEntity(null);
                        props.onSelectPOI(poi);
                    }}
                    isChapterCompleted={props.isChapterCompleted}
                />
            </Mapbox.MapView>

            {/* UI Overlay */}
            {props.isChapterCompleted && !selectedEntity && !selectedPoi && (
                <View style={styles.successContainer}>
                    <Title1 title="Chapitre terminé !" color={Colors.white} />
                    <Button
                        title="Suivant"
                        backgroundColor={Colors.main}
                        textColor={Colors.white}
                        onPress={handleChapterCompleted}
                    />
                </View>
            )}

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
            {selectedEntity && (
                <EntityInfoCard
                    selectedEntity={selectedEntity}
                    onClose={() => setSelectedEntity(null)}
                />
            )}

            <View style={styles.ui}>
                <View style={styles.switch}>
                    <Image
                        source={functions.getIconSource(isGlobe ? 'globe' : 'paper_map')}
                        style={{ width: 24, height: 24, tintColor: Colors.white }}
                    />
                    <Switch value={isGlobe} onValueChange={setIsGlobe} />
                </View>
                <View style={styles.switch}>
                    <Image
                        source={functions.getIconSource('people')}
                        style={{ width: 24, height: 24, tintColor: Colors.white }}
                    />
                    <Switch value={showEntities} onValueChange={setShowEntities} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#000' },
    map: { flex: 1, marginVertical: -35 },
    successContainer: {
        position: 'absolute',
        bottom: 60,
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
    ui: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'column',
        gap: 10,
    },
    switch: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
        borderCurve: 'continuous',
        flexDirection: 'row',
        gap: 10
    }
});