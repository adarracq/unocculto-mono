import Colors from '@/app/constants/Colors';
import Entity from '@/app/models/Entity';
import EntitySnapshot from '@/app/models/EntitySnapshot';
import Mapbox from '@rnmapbox/maps';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';

// --- 1. Dictionnaire des images (Style Plague Inc) ---
const PLAGUE_ICONS = {
    'peoples': require('@/app/assets/icons/peoples.png'),
    /*'bubble-blue': require('@/app/assets/icons/bubble_blue.png'),
    'culture': require('@/app/assets/other/art.png'),
    'bubble-default': require('@/app/assets/icons/bubble_default.png'),*/
};

type Props = {
    snapshots: EntitySnapshot[];
    isVisible: boolean;
    onSelectEntity: (entity: Entity) => void;
};

export default function EntitiesMarkers({ snapshots, isVisible, onSelectEntity }: Props) {

    // --- 2. Logique de calcul du centre (déplacée ici) ---
    const calculateEntityCenter = (entity: EntitySnapshot): [number, number] => {
        let totalLng = 0;
        let totalLat = 0;
        let pointCount = 0;

        if (entity.geometry.type === 'Polygon') {
            const polygonCoords = entity.geometry.coordinates as number[][][];
            polygonCoords[0].forEach((coord: number[]) => {
                totalLng += coord[0];
                totalLat += coord[1];
                pointCount++;
            });
        } else if (entity.geometry.type === 'MultiPolygon') {
            const multiPolygonCoords = entity.geometry.coordinates as number[][][][];
            multiPolygonCoords.forEach((polygon: number[][][]) => {
                polygon[0].forEach((coord: number[]) => {
                    totalLng += coord[0];
                    totalLat += coord[1];
                    pointCount++;
                });
            });
        }

        return pointCount > 0 ? [totalLng / pointCount, totalLat / pointCount] : [0, 0];
    };

    // --- 3. Logique pour choisir l'icône ---
    const getIconNameByType = (type: string | undefined) => {
        switch (type) {
            /*case 'EMPIRE': return 'bubble-red';
            case 'TRIBE': return 'tribe';*/
            default: return 'peoples';
        }
    };

    // --- 4. Préparation du GeoJSON pour les icônes ---
    const iconsGeoJSON = useMemo(() => {
        if (!isVisible) return null;

        return {
            type: 'FeatureCollection',
            features: snapshots.map((snapshot) => ({
                type: 'Feature',
                properties: {
                    snapshot: snapshot,
                    entity: snapshot.entityId, // Important pour le clic
                    iconImageName: getIconNameByType(snapshot.entityId.type)
                },
                geometry: {
                    type: 'Point',
                    coordinates: calculateEntityCenter(snapshot)
                }
            }))
        };
    }, [snapshots, isVisible]);

    const onBubblePress = (event: any) => {
        const feature = event.features[0];
        if (feature?.properties?.entity) {
            onSelectEntity(feature.properties.entity);
        }
    };

    return (
        <>
            {/* Enregistrement des images spécifiques aux entités */}
            <Mapbox.Images images={PLAGUE_ICONS} />

            {/* A. LES POLYGONES */}
            {snapshots.map((snapshot, index) => (
                <Mapbox.ShapeSource
                    key={`snapshot-${index}`}
                    id={`snapshot-${index}`}
                    shape={snapshot.geometry as any}
                >
                    <Mapbox.FillLayer
                        id={`snapshotFill-${index}`}
                        style={{
                            fillColor: Colors.darkGrey,
                            fillOpacity: isVisible ? 1 : 0.1,
                        }}
                    />
                    <Mapbox.LineLayer
                        id={`snapshotLine-${index}`}
                        style={{
                            lineColor: Colors.lightGrey,
                            lineWidth: 1,
                            lineOpacity: isVisible ? 1 : 0,
                        }}
                    />
                </Mapbox.ShapeSource>
            ))}

            {/* B. LES ICÔNES (BULLES) */}
            {isVisible && iconsGeoJSON && (
                <Mapbox.ShapeSource
                    id="entity-names-source"
                    onPress={onBubblePress}
                    hitbox={{ width: 44, height: 44 }}
                    shape={iconsGeoJSON as any}
                >
                    <Mapbox.SymbolLayer
                        id="entity-icon"
                        style={{
                            iconImage: ['get', 'iconImageName'],
                            iconSize: 0.05,
                            iconAllowOverlap: true,
                            iconIgnorePlacement: true,
                            iconAnchor: 'center'
                        }}
                    />
                </Mapbox.ShapeSource>
            )}
        </>
    );
}

const styles = StyleSheet.create({});