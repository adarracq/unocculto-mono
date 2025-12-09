import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function LoadingScreen() {
    const insets = useSafeAreaInsets();
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',


            zIndex: 999
        }}>
            <LottieView
                source={require('@/app/assets/lotties/loading2.json')}
                autoPlay
                loop
                style={{
                    width: 200,
                    height: 200
                }}
            />
        </View>
    )
}