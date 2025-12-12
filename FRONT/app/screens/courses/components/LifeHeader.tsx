import BodyText from '@/app/components/atoms/BodyText';
import Colors from '@/app/constants/Colors';
import User from '@/app/models/User';
import { functions } from '@/app/utils/Functions';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

type Props = {
    user: User;
}

export default function LifeHeader(props: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    // 1. On crée une ref pour savoir si c'est le premier rendu
    const isFirstRender = useRef(true);

    useEffect(() => {
        // 2. Si c'est le premier rendu, on passe à false et ON ARRÊTE LÀ
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // 3. Sinon (les fois suivantes), on lance l'animation
        if (props.user.lifes !== undefined) {
            triggerLifeAnimation();
        }
    }, [props.user.lifes]);

    const triggerLifeAnimation = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
        ]).start();
    };

    return props.user && (
        <View style={styles.container}>
            <Animated.View style={[
                styles.valueContainer,
                { transform: [{ scale: scaleAnim }] }
            ]}>
                <BodyText
                    text={props.user.lifes.toString()}
                    isBold
                />
                <Image
                    source={functions.getIconSource('lightning')}
                    style={{ width: 24, height: 24 }}
                />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 20,
        gap: 20,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1000,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderCurve: 'continuous',
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.darkGrey,
        backgroundColor: Colors.black + '77',
    }
})