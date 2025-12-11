import Colors from '@/app/constants/Colors';
import POI from '@/app/models/POI';
import { functions } from '@/app/utils/Functions';
import Mapbox from '@rnmapbox/maps';
import React, { useState } from 'react';
import { Image, StyleSheet, Switch, View } from 'react-native';

Mapbox.setAccessToken('pk.eyJ1IjoiYW50b2luZWNkIiwiYSI6ImNtaW9hZXRvZTB6Mncza3NidTNqaGhscjkifQ.q-BKGDUHJBBCNL5nf2ftOQ');


type Props = {
    pois: POI[];
    currentIndex: number;
}

export default function MyMap(props: Props) {
    const [isGlobe, setIsGlobe] = useState(true);


    return (
        <View style={styles.page}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={'mapbox://styles/antoinecd/cmiyo08f7000m01s89z5b7y98'}
                logoEnabled={false}
                projection={isGlobe ? 'globe' : 'mercator'}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={true}
            >
                <Mapbox.Camera
                    zoomLevel={2.5}
                    centerCoordinate={[15, 45]}
                />
                {/* Ciel atmosphérique (Pour l'effet Globe réaliste) */}
                {isGlobe && <Mapbox.Atmosphere
                    style={{
                        color: Colors.main,
                        highColor: Colors.mainVeryDark,

                        spaceColor: '#000000',
                        starIntensity: 10,
                    }}
                />}


            </Mapbox.MapView>

            <View style={styles.ui}>
                <View style={styles.box}>
                    <Image
                        source={functions.getIconSource(isGlobe ? 'globe' : 'paper_map')}
                        style={{ width: 24, height: 24, tintColor: Colors.white }}
                    />
                    <Switch
                        value={isGlobe}
                        onValueChange={setIsGlobe}
                        thumbColor={Colors.main}
                        trackColor={{ false: Colors.darkGrey, true: Colors.white }}
                    />
                </View>
            </View>
        </View>

    );

}



const styles = StyleSheet.create({
    page: { flex: 1 },
    map: {
        flex: 1,
        marginVertical: -35,
    },
    ui: {
        position: 'absolute',
        bottom: 50,
        right: 30
    },
    box: {
        backgroundColor: Colors.black,
        padding: 10,
        borderRadius: 10,
        borderCurve: 'continuous',
        flexDirection: 'row',
        gap: 10
    }
});