import BodyText from '@/app/components/atoms/BodyText';
import Colors from '@/app/constants/Colors';
import { functions } from '@/app/utils/Functions';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

export const Layout = {
    colLeft: width * 0.25,  // 25% (Centre Gauche)
    colRight: width * 0.75, // 75% (Centre Droite)
    colCenter: width * 0.5, // 50%
    circleSize: 100,        // Taille du rond
};

type Props = {
    date: number;
    isNextRight: boolean;
    withLine?: boolean;
}

const CONNECTOR_HEIGHT = 120; // On augmente la hauteur pour qu'il y ait de la place
const OVERLAP = -30; // On fait remonter le connecteur SOUS l'élément précédent

export default function TimelineConnector({ date, isNextRight, withLine }: Props) {
    const { width } = Dimensions.get('window');

    // Si prochain à droite : Départ Gauche -> Arrivée Droite
    const startX = isNextRight ? Layout.colLeft : Layout.colRight;
    const endX = isNextRight ? Layout.colRight : Layout.colLeft;

    return (
        <View style={styles.container}>
            {/* Calque SVG */}
            {withLine && <View style={StyleSheet.absoluteFill}>
                <Svg height="100%" width={width}>
                    {/* Ligne 1 : Haut vers Centre */}
                    <Line
                        x1={startX}
                        y1="0"
                        x2={width / 2}
                        y2="50%"
                        stroke="rgba(255, 255, 255, 0.5)"
                        strokeWidth="3"
                        strokeDasharray="8, 8"
                    />
                    {/* Ligne 2 : Centre vers Bas */}
                    <Line
                        x1={width / 2}
                        y1="50%"
                        x2={endX}
                        y2="100%"
                        stroke="rgba(255, 255, 255, 0.5)"
                        strokeWidth="3"
                        strokeDasharray="8, 8"
                    />
                </Svg>
            </View>}

            {/* Badge Date */}
            <View style={styles.dateBadge}>
                <BodyText
                    text={functions.dateToString(date)}
                    color={Colors.white}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: CONNECTOR_HEIGHT,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: OVERLAP,    // <--- C'est ça qui "colle" la ligne au cercle du haut
        marginBottom: OVERLAP, // <--- C'est ça qui "colle" la ligne au cercle du bas
        zIndex: -1,            // <--- Important : passe DERRIÈRE les cercles
    },
    dateBadge: {
        backgroundColor: Colors.black,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        zIndex: 10,
    }
});