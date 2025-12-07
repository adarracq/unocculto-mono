import Title1 from '@/app/components/atoms/Title1';
import Title2 from '@/app/components/atoms/Title2';
import Colors from '@/app/constants/Colors';
import Chapter from '@/app/models/Chapter';
import { functions } from '@/app/utils/Functions';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';


type Props = {
    chapter: Chapter;
    percentage: number;
    isUnlocked: boolean;
    bumping?: boolean;
    onPress: () => void;
}
export default function ChapterOnList(props: Props) {

    const spinValue = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // 2. Définir l'animation
        const startSpinning = () => {
            spinValue.setValue(0); // Réinitialise à 0 au début de chaque boucle
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,             // Va de 0 à 1 (soit 0% à 100% du tour)
                    duration: 10000,         // Durée d'un tour complet en ms (ici 3 secondes)
                    easing: Easing.linear,  // Vitesse constante (important pour que ça tourne rond)
                    useNativeDriver: true,  // INDISPENSABLE pour la fluidité sur mobile
                })
            ).start();
        };

        startSpinning();
    }, [spinValue]); // Se lance au montage du composant



    // 3. Interpoler la valeur : transformer le 0->1 en degrés '0deg'->'360deg'
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
        // 2. On définit une séquence : Grossir (1.1) puis Revenir à la normale (1)
        // On utilise 'timing' avec 'Easing' pour un mouvement de respiration fluide.
        const pulseSequence = Animated.sequence([
            // Phase 1 : Grossir
            Animated.timing(scaleAnim, {
                toValue: 1.05,   // Grossit de 8% (ajustez selon l'intensité voulue)
                duration: 1000,   // Durée de la montée (ms)
                easing: Easing.inOut(Easing.ease), // Accélération/décélération douces
                useNativeDriver: true,
            }),
            // Phase 2 : Rapetisser
            Animated.timing(scaleAnim, {
                toValue: 1,      // Revient à la taille de départ
                duration: 1000,   // Durée de la descente
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            })
        ]);

        // 3. On lance cette séquence en boucle infinie (-1 signifie infini pour certaines libs, mais loop() suffit ici)
        Animated.loop(pulseSequence).start();

    }, [scaleAnim]);


    return (
        <TouchableOpacity onPress={props.onPress}
            style={[styles.container,
            {
                opacity: props.isUnlocked ? 1 : 0.5,
                elevation: props.isUnlocked ? 10 : 0,
                transform: [{ scale: props.bumping ? scaleAnim : 1 }]
            }]}
        >
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                zIndex: 1,
            }}>
                <Animated.Image
                    source={
                        props.isUnlocked ?
                            { uri: props.chapter.base64Icon }
                            :
                            functions.getIconSource('lock')
                    }
                    style={{
                        width: 80,
                        height: 80,
                        transform: props.isUnlocked ? [{ rotate: spin }] : [],
                    }} />
                <Title1 title={props.chapter.labelFR} color={Colors.main} />
                {props.isUnlocked &&
                    <Title2 title={`${props.percentage * 100}%`} color={Colors.white} />
                }
            </View>

            <Progress.Circle
                size={250}
                progress={props.isUnlocked ? props.percentage : 0}
                color={Colors.white}
                thickness={8}
                borderWidth={0}
                style={{
                    position: 'absolute',
                }}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.black,
        width: 250,
        height: 250,
        padding: 20,
        gap: 10,
        borderRadius: 200,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
    },
})