import BodyText from '@/app/components/atoms/BodyText';
import ProgressBarLvl from '@/app/components/molecules/ProgressBarLvl';
import Colors from '@/app/constants/Colors';
import User from '@/app/models/User';
import { functions } from '@/app/utils/Functions';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

type Props = {
    user: User;
}

export default function SmallProfileHeader(props: Props) {

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
        if (props.user.coins !== undefined) {
            triggerCoinAnimation();
        }
    }, [props.user.coins]);

    const triggerCoinAnimation = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
        ]).start();
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                <Animated.View style={[
                    styles.valueContainer,
                    { transform: [{ scale: scaleAnim }] }
                ]}>
                    <BodyText
                        text={props.user.coins + ''}
                        isBold
                    />
                    <Image
                        source={functions.getIconSource('coin')}
                        style={{ width: 24, height: 24 }}
                    />
                </Animated.View>
                <View style={styles.valueContainer}>
                    <Image
                        source={functions.getIconSource('lightning')}
                        style={{ width: 24, height: 24 }}
                    />
                    <BodyText
                        text={props.user.lifes?.toString()}
                        isBold
                    />
                </View>
            </View>
            <ProgressBarLvl coins={props.user.coins || 0} width={Dimensions.get('window').width - 40} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.black,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 20,
        gap: 20,
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
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
        backgroundColor: Colors.realBlack + '22'
    }
})