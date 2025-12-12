import BodyText from '@/app/components/atoms/BodyText';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import Chapter from '@/app/models/Chapter';
import React from 'react';
import { Animated, Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';

type Props = {
    chapter: Chapter;
    onPress: () => void;
    isRight?: boolean;
    isLast?: boolean; // Pour ne pas afficher la ligne sur le dernier élément
}

const CARD_WIDTH = Dimensions.get('window').width * 0.75; // Un peu plus large pour lisibilité

export default function FreeExploPOI(props: Props) {

    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    return (
        <View style={styles.rowContainer}>
            {/* Ligne de connexion (Optionnelle, pour effet parcours) */}
            {/*!props.isLast && (
                <View style={[
                    styles.connectorLine,
                    {
                        left: props.isRight ? '70%' : '30%',

                    }
                ]} />
            )*/}

            <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
                <Pressable
                    onPress={props.onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[
                        styles.cardContainer,
                        {
                            alignSelf: props.isRight ? 'flex-end' : 'flex-start',
                            // Petit décalage pour ne pas coller aux bords
                            marginLeft: props.isRight ? 0 : 20,
                            marginRight: props.isRight ? 20 : 0,
                        }
                    ]}
                >
                    {/* En-tête de la carte : Icone + Titre */}
                    <View style={styles.header}>
                        {!props.isRight && <View style={{ flex: 1 }}>
                            <Title1 title={props.chapter.labelFR} isRight />
                        </View>}
                        <View style={styles.iconWrapper}>
                            <Image
                                source={{ uri: props.chapter.base64Icon }}
                                style={styles.icon}
                            />
                        </View>
                        {props.isRight && <View style={{ flex: 1 }}>
                            <Title1 title={props.chapter.labelFR} isLeft />
                        </View>}
                    </View>
                    <View>
                        <View style={styles.statusBadge}>
                            <BodyText
                                text='Voir plus'
                                color={Colors.white}
                            />
                        </View>
                    </View>
                </Pressable>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        position: 'relative',
        marginVertical: 10,
        width: '100%',
    },
    // Le design de la carte
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: Colors.black,
        borderRadius: 20,
        borderCurve: 'continuous',
        padding: 20,
        // Ombre subtile et diffuse (Glow effect) pour le mode sombre
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: Colors.darkGrey
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    statusBadge: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.main,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderCurve: 'continuous',
    },
    // Styles pour la ligne de connexion
    connectorLine: {
        position: 'absolute',
        width: 2,
        height: 100, // Hauteur suffisante pour toucher le prochain item
        backgroundColor: Colors.lightGrey,
        left: '50%',
        bottom: -50,
        zIndex: -1,
    },
})