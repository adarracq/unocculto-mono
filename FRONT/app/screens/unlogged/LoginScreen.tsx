import Button from '@/app/components/atoms/Button'
import SmallText from '@/app/components/atoms/SmallText'
import Title0 from '@/app/components/atoms/Title0'
import Colors from '@/app/constants/Colors'
import { NavParams } from '@/app/navigations/UnloggedNav'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types'

type Props = NativeStackScreenProps<NavParams, 'Login'>;
export default function LoginScreen({ navigation, route }: Props) {


    function loginWithEmail() {
        navigation.navigate('EmailInput');
    }
    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <View style={{ gap: 20 }}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/images/logo_white_filled.png')}
                        style={styles.logo}
                    />
                </View>
                <Title0 title='Commencez dès maintenant votre voyage à travers le savoir'
                    color={Colors.white} isLeft style={{ paddingRight: 80 }} />
            </View>
            <View style={{ gap: 20 }}>
                <Button title="Continuer avec votre e-mail"
                    backgroundColor={Colors.main}
                    textColor={Colors.white}
                    icon='mail'
                    style={{ borderColor: Colors.white, borderWidth: 2 }}
                    onPress={loginWithEmail} />
            </View>
            <TouchableOpacity>
                <SmallText text="Si vous créez un nouveau compte, les conditions générales et la politique de confidentialité s'appliqueront."
                    color={Colors.white} isItalic />
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.main,
        padding: 20,
        paddingVertical: 60,
        justifyContent: 'space-between'
    },
    logoContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 16,
        borderCurve: 'continuous',
    },
    logo: {
        width: 50,
        height: 50,
    }
})