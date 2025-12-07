import worldData from '@/app/assets/zones/world_bc123000.json';
import Mapbox, { FillExtrusionLayer } from '@rnmapbox/maps';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';

Mapbox.setAccessToken('pk.eyJ1IjoiYW50b2luZWNkIiwiYSI6ImNtaW9hZXRvZTB6Mncza3NidTNqaGhscjkifQ.q-BKGDUHJBBCNL5nf2ftOQ');

export default function MapLibre() {
    const [isGlobe, setIsGlobe] = useState(true);
    const [showNames, setShowNames] = useState(true);

    // Récupérer dynamiquement tous les noms uniques des empires/civilisations du JSON
    const getAllEmpireNames = () => {
        const empires = new Set<string>();
        (worldData as any).features.forEach((feature: any) => {
            if (feature.properties.PARTOF && feature.properties.PARTOF !== null) {
                empires.add(feature.properties.PARTOF);
            }
        });
        return Array.from(empires);
    };

    const empireNames = getAllEmpireNames();

    // Fonction pour calculer le centre d'un empire
    const calculateEmpireCenter = (empireName: string): [number, number] => {
        const features = (worldData as any).features.filter((feature: any) =>
            feature.properties.PARTOF === empireName
        );

        let totalLng = 0;
        let totalLat = 0;
        let pointCount = 0;

        features.forEach((feature: any) => {
            if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
                    totalLng += coord[0];
                    totalLat += coord[1];
                    pointCount++;
                });
            } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((polygon: any) => {
                    polygon[0].forEach((coord: [number, number]) => {
                        totalLng += coord[0];
                        totalLat += coord[1];
                        pointCount++;
                    });
                });
            }
        });

        return pointCount > 0 ? [totalLng / pointCount, totalLat / pointCount] : [0, 0];
    };

    // Générer automatiquement les labels des empires
    const empireLabels = empireNames.map(empireName => ({
        name: empireName,
        coordinates: calculateEmpireCenter(empireName)
    }));

    // Fonction pour générer une couleur basée sur le nom de l'empire
    const getColorForEmpire = (empireName: string | null) => {
        if (!empireName) return '#8B4513'; // Couleur par défaut pour les zones sans nom

        /*const colors = [        
        '#8B0000', '#006400', '#4B0082', '#FF8C00', '#2F4F4F',   
        '#DC143C', '#00008B', '#32CD32', '#8B008B', '#FF4500',       
        '#2E8B57', '#B22222', '#5F9EA0', '#D2691E', '#FF1493'       
        ];*/
        /*const colors = [
        '#5F9EA0', '#32CD32', '#2E8B57'
        ];*/

        const colors = [
            '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
        ];

        // Utiliser un hash simple du nom pour assigner une couleur
        let hash = 0;
        for (let i = 0; i < empireName.length; i++) {
            hash = empireName.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const eiffelFeature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [2.2945, 48.8584] }
    };

    const handleTourEiffelPress = (event: any) => {
        Alert.alert('Monument 3D', 'Vous avez cliqué sur la Tour Eiffel en 3D !');
    };

    return (
        <View style={styles.page}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={'mapbox://styles/antoinecd/cmiog0v9w000a01r0aya571gu'}
                // draft
                //styleURL={'mapbox://styles/antoinecd/cmiojt5x2009r01sb4vad4c0i/draft'}
                logoEnabled={false}
                projection={isGlobe ? 'globe' : 'mercator'}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={true}
            >



                {/* Caméra : Vue de loin pour voir la courbe de la terre */}
                <Mapbox.Camera
                    zoomLevel={2.5}
                    centerCoordinate={[15, 45]}
                />

                <FillExtrusionLayer
                    id="pion-eiffel"
                    minZoomLevel={0}
                    maxZoomLevel={2000002}
                    style={{
                        fillExtrusionColor: '#aaa', // Couleur du pion
                        fillExtrusionHeight: 300, // Hauteur réelle en mètres (Tour Eiffel = 300m)
                        fillExtrusionBase: 0,
                        fillExtrusionOpacity: 0.9
                    }}
                />



                {/* Ciel atmosphérique (Pour l'effet Globe réaliste) */}
                {isGlobe && <Mapbox.Atmosphere
                    style={{
                        color: '#77B5FE',
                        highColor: '#191970',
                        horizonBlend: .2,
                        spaceColor: '#000000',
                        starIntensity: 10,
                    }}
                />}



                {/* Toutes les zones historiques du monde en 100 av. J.-C. */}
                <Mapbox.ShapeSource
                    id="historicalZones"
                    shape={worldData as any}
                    onPress={(event: any) => {
                        const empireName = event.features[0]?.properties?.PARTOF;
                        if (empireName) {
                            Alert.alert('Empire/Civilization', empireName);
                        }
                    }}
                >

                    <Mapbox.FillLayer
                        id="historicalZonesFill"
                        filter={[
                            'in',
                            ['get', 'PARTOF'],
                            ['literal', empireNames]
                        ]}
                        style={{
                            fillColor: [
                                'case',
                                ...empireNames.flatMap(empireName => [
                                    ['==', ['get', 'PARTOF'], empireName],
                                    getColorForEmpire(empireName)
                                ]),
                                '#8B4513'
                            ],
                            fillOpacity: 1
                        }}
                    />

                    {<Mapbox.LineLayer
                        id="historicalZonesBorder"
                        filter={[
                            'in',
                            ['get', 'PARTOF'],
                            ['literal', empireNames]
                        ]}
                        style={{
                            lineColor: '#000000ff',
                            lineWidth: 1,
                            lineOpacity: .5
                        }}
                    />}

                </Mapbox.ShapeSource>



                {/* Labels des empires en tant qu'annotations */}
                {showNames && empireLabels.map((empire, index) => (
                    <Mapbox.PointAnnotation
                        key={empire.name}
                        id={`empire-${index}`}
                        coordinate={empire.coordinates}
                    >
                        <Text style={styles.empireName}>{empire.name}</Text>
                    </Mapbox.PointAnnotation>
                ))}


                {/* Tour Eiffel à Paris */}
                <Mapbox.Models
                    models={{
                        'test': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb'
                    }}
                />
                <Mapbox.ShapeSource
                    id="source-eiffel2"
                    shape={{ type: 'Feature', geometry: { type: 'Point', coordinates: [2.2545, 48.8584] } } as any}
                    onPress={() => Alert.alert('3D', 'Coucou !')}
                >
                    <Mapbox.ModelLayer
                        id="layer-eiffel2"
                        style={{
                            modelId: 'test', // Correspond à la clé dans <Mapbox.Models>
                            modelScale: [20000, 20000, 20000],
                            modelTranslation: [0, 0, 0],
                            // vue isometrique
                            modelRotation: [60, 0, 0],
                            modelOpacity: 1
                        }}
                    />
                </Mapbox.ShapeSource>

            </Mapbox.MapView>

            <View style={styles.ui}>
                <View style={styles.box}>
                    <Text style={{ color: 'white' }}>{isGlobe ? 'Globe' : 'Mercator'}</Text>
                    <Switch value={isGlobe} onValueChange={setIsGlobe} />
                </View>
                <View style={styles.box}>
                    <Text style={{ color: 'white' }}>Names</Text>
                    <Switch value={showNames} onValueChange={setShowNames} />
                </View>
            </View>
        </View>

    );

}



const styles = StyleSheet.create({
    page: { flex: 1 },
    map: { flex: 1 },
    dot: { width: 20, height: 20, backgroundColor: 'red', borderRadius: 10 },
    eiffelDot: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF6B6B'
    },
    eiffelText: {
        fontSize: 20
    },
    empireName: {
        zIndex: 10,
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: .5,
        borderColor: '#FFFFFF',
        overflow: 'hidden',
        elevation: 5
    },
    ui: { position: 'absolute', top: 50, right: 20 },
    box: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 10, flexDirection: 'row', gap: 10 }
});