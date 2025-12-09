import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import Chapter from '@/app/models/Chapter';
import { functions } from '@/app/utils/Functions';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

type Props = {
    chapter: Chapter;
    isUnlocked: boolean;
    bumping?: boolean;
    isRight?: boolean;
    onPress: () => void;
}

export default function ChapterOnList(props: Props) {

    const spinValue = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pressScaleValue = useRef(new Animated.Value(1)).current;

    // Animation de press
    const handlePressIn = () => {
        Animated.spring(pressScaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    useEffect(() => {
        if (props.bumping) {
            // Rotation lente de l'anneau extérieur (optionnel)
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();

            // Effet de pulsation (Battement de coeur)
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            scaleAnim.setValue(1); // Reset si plus bumping
        }
    }, [props.bumping]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={[
            styles.wrapper,
        ]}>
            <Animated.View style={[{ transform: [{ scale: pressScaleValue }] }]}>
                <Pressable
                    onPress={props.onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={!props.isUnlocked}
                    style={[styles.touchableArea]}
                >
                    {/* TITRE */}
                    {!props.isRight && <View style={styles.textContainer}>
                        <Title1
                            title={props.chapter.labelFR}
                            color={Colors.white}
                            style={styles.titleText}
                        />
                    </View>}
                    {/* CERCLE PRINCIPAL */}
                    <Animated.View style={[
                        styles.circleContainer,
                        {
                            transform: [{ scale: scaleAnim }], // L'animation de scale s'applique ici
                            borderColor: props.bumping ? Colors.white : Colors.darkGrey,
                            borderWidth: props.bumping ? 4 : 2,
                            backgroundColor: props.isUnlocked ? Colors.black : Colors.darkGrey,
                        }
                    ]}>
                        {/* ICONE */}
                        <Animated.Image
                            source={props.isUnlocked ? { uri: props.chapter.base64Icon } : functions.getIconSource('lock')}
                            style={{
                                width: 50,
                                height: 50,
                                transform: props.bumping ? [{ rotate: spin }] : [],
                            }}
                        />
                    </Animated.View>

                    {/* TITRE */}
                    {props.isRight && <View style={styles.textContainer}>
                        <Title1
                            title={props.chapter.labelFR}
                            color={Colors.white}
                            style={styles.titleText}
                        />
                    </View>}
                </Pressable>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginVertical: 5,
        zIndex: 10,
    },
    touchableArea: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 20,
    },
    circleContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderCurve: 'continuous',
        alignItems: 'center',
        justifyContent: 'center',
        // Ombres
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    textContainer: {
        alignItems: 'center',
        width: '50%',
    },
    titleText: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    }
})