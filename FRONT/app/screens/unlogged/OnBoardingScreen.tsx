import BodyText from '@/app/components/atoms/BodyText';
import Button from '@/app/components/atoms/Button';
import Title0 from '@/app/components/atoms/Title0';
import Colors from '@/app/constants/Colors';
import { NavParams } from '@/app/navigations/UnloggedNav';
import { functions } from '@/app/utils/Functions';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

const slides = [
    {
        key: 1,
        title: "Un voyage à travers le savoir",
        text: "Comprenez enfin le monde dans sa globalité,\n du Big Bang à nos jours.",
        image: require('../../assets/images/onboarding/1.png'),
        icon: 'books',
        iconText: 'COURS'
    },
    {
        key: 2,
        title: 'Mémorisez sans effort',
        text: 'Ancrez vos connaissances pour toujours grâce à nos flashcards intelligentes.',
        image: require('../../assets/images/onboarding/2.png'),
        icon: 'cards',
        iconText: 'FLASHCARDS'
    },
    {
        key: 3,
        title: 'Défiez le monde',
        text: 'Affrontez vos amis en duel et prouvez que vous êtes le meilleur.',
        image: require('../../assets/images/onboarding/3.png'),
        icon: 'duel',
        iconText: 'DUELS'
    }
];

type Props = NativeStackScreenProps<NavParams, 'OnBoarding'>;

export default function OnBoardingScreen({ navigation, route }: Props) {



    const renderItem = ({ item }: { item: { key: number; title: string; text: string; image: any; icon: string; iconText: string } }) => {
        return (
            <View
                style={styles.container}>
                <Title0 title="Unocculto" color={Colors.white} style={{ fontSize: 40 }} />
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 50,
                    paddingBottom: 50
                }}>

                    <Image source={item.image}
                        style={{
                            maxWidth: Dimensions.get('window').width - 100,
                            maxHeight: Dimensions.get('window').height / 4,
                            resizeMode: 'contain',
                        }}
                    />
                    <View style={{ gap: 16, alignItems: 'center' }}>

                        <View style={{
                            backgroundColor: Colors.white,
                            borderRadius: 16,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                            paddingHorizontal: 16,
                            paddingVertical: 6
                        }}>
                            <Image source={functions.getIconSource(item.icon)}
                                style={{
                                    width: 16,
                                    height: 16,
                                    tintColor: Colors.mainDark,
                                }} />

                            <BodyText text={item.iconText}
                                color={Colors.mainDark} isBold />
                        </View>
                        <Title0 title={item.title} color={Colors.white} />
                        <BodyText text={item.text} color={Colors.white} centered />
                    </View>
                </View>
            </View>
        );
    };

    const renderNextButton = () => {
        return (
            <View style={{
                width: 70,
                height: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 16
            }}>
                <Image source={require('../../assets/icons/arrow-right.png')} style={{ width: 30, resizeMode: 'contain', }} />
            </View>
        );
    };

    const renderDoneButton = () => {
        return (
            <Button
                title="Commencer votre Voyage"
                onPress={() => {
                    navigation.navigate('Login');
                }}
                backgroundColor={Colors.white}
                textColor={Colors.main}
                style={{ width: Dimensions.get('window').width - 40 }}
            />
        )
    }

    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={{ paddingBottom: 20, flex: 1 }}>
            <AppIntroSlider
                renderItem={renderItem}
                data={slides}
                renderNextButton={renderNextButton}
                renderDoneButton={renderDoneButton}
                activeDotStyle={{
                    backgroundColor: Colors.white,
                    width: 30
                }}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 70,
        paddingHorizontal: 20
    }
});