import Colors from '@/app/constants/Colors';
import Levels from '@/app/constants/Levels';
import { functions } from '@/app/utils/Functions';
import React, { useEffect, useMemo, useRef } from 'react'; // Ajout de useState et useMemo
import { Animated, Image, View } from 'react-native';
import * as Progress from 'react-native-progress';
import Title1 from '../atoms/Title1';
import Title2 from '../atoms/Title2';

type ProgressBarLvlProps = {
    coins: number;
    width: number;
}

export default function ProgressBarLvl(props: ProgressBarLvlProps) {
    const levels = Levels.levels;

    // Sécurité : on s'assure que coins est un nombre
    const safeCoins = props.coins || 0;

    // Animation Refs
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isFirstRender = useRef(true);

    // LOGIQUE DE CALCUL (Extraite pour être réutilisable)
    // On utilise useMemo pour recalculer automatiquement dès que safeCoins change
    const progressData = useMemo(() => {
        let lvl = 1; // Niveau 1 par défaut
        let coinsCurrent = safeCoins;
        let coinsTotal = 1; // Évite division par zéro

        for (let i = 0; i < levels.length; i++) {
            if (safeCoins >= levels[i].coins) {
                lvl = levels[i].lvl;

                // Calcul du prochain palier
                const nextLevelCoins = (i + 1 < levels.length)
                    ? levels[i + 1].coins
                    : levels[i].coins * 1.5; // Fallback fin du jeu

                coinsCurrent = safeCoins;
                coinsTotal = nextLevelCoins;
            }
        }

        if (coinsTotal === 0) coinsTotal = 1;

        return { lvl, coinsCurrent, coinsTotal };
    }, [safeCoins]); // Se recalcule uniquement si les pièces changent

    // ANIMATION
    const triggerAnimation = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true })
        ]).start();
    }

    // GESTION DE L'EFFET (Uniquement pour l'animation "Pop")
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            triggerAnimation();
        }
    }, [safeCoins]);

    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: props.width,
                alignItems: 'flex-end'
            }}>
                {/* Niveau */}
                <Title1 title={'Niveau ' + progressData.lvl} color={Colors.main} />

                {/* Score Animé */}
                <Animated.View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    gap: 0,
                    transform: [{ scale: scaleAnim }]
                }}>
                    <Title1 title={progressData.coinsCurrent.toString()} color={Colors.white} />
                    <Title2 title={'/' + progressData.coinsTotal} color={Colors.lightGrey} style={{ fontFamily: 'title-regular' }} />
                    <Image
                        source={functions.getIconSource('coin')}
                        style={{ width: 30, height: 30, marginLeft: 4 }}
                    />
                </Animated.View>
            </View>

            <Progress.Bar
                progress={progressData.coinsCurrent / progressData.coinsTotal}
                width={props.width}
                height={8}
                color={Colors.main}
                unfilledColor={Colors.lightGrey}
                borderWidth={0}
                borderRadius={4}
                useNativeDriver={true}
            />
        </View>
    )
}