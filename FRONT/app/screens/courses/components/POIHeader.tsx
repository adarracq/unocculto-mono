import BackArrow from '@/app/components/atoms/BackArrow';
import Title0 from '@/app/components/atoms/Title0';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

type Props = {
    title: string;
    imageUrl: string;
    onBack: () => void;
}

export default function POIHeader({ title, imageUrl, onBack }: Props) {

    return (
        <View style={styles.headerContainer}>
            <BackArrow onPress={onBack} />
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
            >

                {/* Overlay sombre pour la lisibilité */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                >
                    <View>
                    </View>

                    <View style={styles.titleContainer}>
                        <Title0 title={title} style={styles.title} isLeft />
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 350,
        width: '100%',
    },
    image: { flex: 1, justifyContent: 'space-between' },
    gradient: { flex: 1, justifyContent: 'space-between', padding: 20 },
    titleContainer: { marginBottom: 20 },
    title: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {
            width: -1,
            height: 1
        },
        textShadowRadius: 10
    }
});