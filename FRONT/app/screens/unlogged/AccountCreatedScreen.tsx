import BodyText from '@/app/components/atoms/BodyText';
import Button from '@/app/components/atoms/Button';
import Title0 from '@/app/components/atoms/Title0';
import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { NavParams } from '@/app/navigations/UnloggedNav';
import AsyncStorageUser from '@/app/utils/AsyncStorageUser';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';


type Props = NativeStackScreenProps<NavParams, 'AccountCreated'>;
export default function AccountCreatedScreen({ navigation, route }: Props) {

    const [user, setUser] = useContext(UserContext);


    const next = () => {
        let _user = {
            email: route.params.user.email,
            pseudo: route.params.user.email.split('@')[0],
            themes: route.params.user.themes,
        };
        AsyncStorageUser.setUser(_user);
        setUser(_user);
    };

    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <View></View>
            <View style={{ gap: 20 }}>
                <Image source={require('@/app/assets/images/world.png')}
                    style={{
                        width: Dimensions.get('window').width - 100,
                        height: Dimensions.get('window').height / 3,
                        resizeMode: 'contain',
                        marginBottom: 30,
                    }}
                />
                <Title0 title={'Profil complété !'}
                    color={Colors.white} />
                <BodyText
                    text={'Vous pouvez désormais accéder à toutes les fonctionnalités de l\'application. Bonne découverte !'}
                    color={Colors.white}
                    centered
                />

            </View>
            <Button title={'Démarrer'}
                backgroundColor={Colors.white}
                onPress={next} />

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingVertical: 60,
        justifyContent: 'space-between'
    },
})