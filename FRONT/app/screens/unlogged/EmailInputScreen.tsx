import BackArrow from '@/app/components/atoms/BackArrow';
import Button from '@/app/components/atoms/Button';
import Title0 from '@/app/components/atoms/Title0';
import InputField from '@/app/components/molecules/InputField';
import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import ProgressBar from '@/app/components/molecules/ProgressBar';
import Colors from '@/app/constants/Colors';
import { useApi } from '@/app/hooks/useApi';
import { NavParams } from '@/app/navigations/UnloggedNav';
import { userService } from '@/app/services/user.service';
import AsyncStorageUser from '@/app/utils/AsyncStorageUser';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';


type Props = NativeStackScreenProps<NavParams, 'EmailInput'>;
export default function EmailInputScreen({ navigation, route }: Props) {

    const [email, setEmail] = useState('');
    const [emailErrorText, setEmailErrorText] = useState<string | null>(null);

    const { execute: loginOrSignup, loading } = useApi(
        (emailData: { email: string }) => userService.loginOrSignup(emailData),
        'EmailInputScreen - loginOrSignup'
    );

    function onEmailChange(text: string) {

        setEmail(text);

        if (!text || text === '') {
            setEmailErrorText('Veuillez entrer un email');
        }
        else if (!/\S+@\S+\.\S+/.test(text)) {
            setEmailErrorText('Veuillez entrer un email valide');
        }
        else {
            setEmailErrorText(null);
        }
    }

    const next = async () => {
        // if no input we show an error
        if (!email || email === '') {
            showMessage({
                message: 'Erreur',
                description: 'Veuillez entrer un email',
                type: 'danger',
            })
            setEmailErrorText('Veuillez entrer un email');
            return;
        }

        // if email not valid we show an error
        if (emailErrorText) {
            showMessage({
                message: 'Erreur',
                description: emailErrorText,
                type: 'danger',
            });
            return;
        }

        setEmailErrorText(null);

        const result = await loginOrSignup({ email: email.toLowerCase() });
        if (result) {
            if (result.message) {
                navigation.navigate('CheckEmailCode', { email: email.toLowerCase(), loginOrSignup: result.message });
                AsyncStorageUser.setToken(result.token);
            }
            else {
                showMessage({
                    message: 'Erreur',
                    description: result.message,
                    type: 'danger',
                });
            }
        }
    }

    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]} style={styles.container}>
            <BackArrow onPress={() => navigation.goBack()} />
            <View style={{ gap: 24 }}>
                <ProgressBar progress={1} total={4} title="E-mail" width={80} />
                <Title0 title={'Quelle est votre adresse e-mail ?'} isLeft />
                <InputField placeholder="pierre.dupont@gmail.com"
                    value={email}
                    title={'E-mail'}
                    onChangeText={(text) => { onEmailChange(text) }}
                    errorText={emailErrorText}
                />
            </View>
            <Button title="Suivant" backgroundColor={Colors.white} textColor={Colors.main}
                onPress={next} />

            {
                loading && <LoadingScreen />
            }
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50,
    },
})