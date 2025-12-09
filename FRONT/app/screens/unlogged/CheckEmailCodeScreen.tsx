import BackArrow from '@/app/components/atoms/BackArrow';
import BodyText from '@/app/components/atoms/BodyText';
import SmallText from '@/app/components/atoms/SmallText';
import Title0 from '@/app/components/atoms/Title0';
import InputField from '@/app/components/molecules/InputField';
import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import ProgressBar from '@/app/components/molecules/ProgressBar';
import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { useApi } from '@/app/hooks/useApi';
import User from '@/app/models/User';
import { NavParams } from '@/app/navigations/UnloggedNav';
import { userService } from '@/app/services/user.service';
import AsyncStorageUser from '@/app/utils/AsyncStorageUser';
import { functions } from '@/app/utils/Functions';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<NavParams, 'CheckEmailCode'>;
export default function CheckEmailCodeScreen({ navigation, route }: Props) {

    const email = route.params.email;
    const loginOrSignup = route.params.loginOrSignup;
    const [code, setCode] = React.useState('');
    const [codeErrorText, setCodeErrorText] = useState<string | null>(null);
    const [timerCount, setTimer] = useState(60);
    const [user, setUser] = useContext(UserContext);

    const { execute: verifyEmailCode, loading: verifyLoading } = useApi(
        (data: { email: string, code: string }) => userService.verifyEmailCode(data),
        'CheckEmailCodeScreen - verifyEmailCode'
    );

    const { execute: resendCode, loading: resendLoading } = useApi(
        (emailData: { email: string }) => userService.loginOrSignup(emailData),
        'CheckEmailCodeScreen - resendCode'
    );

    const loading = verifyLoading || resendLoading;

    const onCodeChange = async (text: string) => {
        setCode(text);
        if (!text || text === '') {
            setCodeErrorText('Veuillez entrer un code');
        }
        else if (text.length < 6) {
            setCodeErrorText('Veuillez entrer un code valide');
        }
        else {
            setCodeErrorText(null);
            setCode(text);

            const response = await verifyEmailCode({ email, code: text });
            if (response && response.message) {
                if (loginOrSignup === 'login') {
                    let user = {
                        email: email,
                        type: response.type == 0 ? 'user' : 'agent'
                    }
                    setUser(user);
                    AsyncStorageUser.setUser(user);
                }
                else if (loginOrSignup === 'signup') {
                    let user = new User(email);
                    navigation.navigate('ChoosePseudo', { user });
                }
            } else {
                setCodeErrorText('Code invalide');
            }
        }
    }

    const resendEmailCode = async () => {
        startInterval();

        const res = await resendCode({ email: email });
        if (res && res.message) {
            showMessage({
                message: 'Code envoyé',
                description: 'Verifiez votre boite e-mail',
                type: 'success',
            });
            AsyncStorageUser.setToken(res.token);
        } else {
            showMessage({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de l\'envoi du code',
                type: 'danger',
            });
        }
    }

    const startInterval = () => {
        setTimer(60);
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                if (lastTimerCount == 0) {
                    //your redirection to Quit screen
                    return lastTimerCount;
                } else {
                    if (lastTimerCount <= 1) clearInterval(interval);
                    return lastTimerCount - 1;
                }
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    }

    useEffect(() => {
        startInterval();
    }, []);



    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <BackArrow onPress={() => navigation.goBack()} />
            <View style={{ gap: 20 }}>
                <ProgressBar progress={2} total={5} title="Verification" width={80} />
                <View style={styles.mailContainer}>
                    <Image source={functions.getIconSource('mail')}
                        style={styles.mail}
                    />
                </View>
                <Title0 title='Verifiez vos e-mails' isLeft />
                <View>
                    <BodyText text='Entrez le code envoyé par e-mail à ' />
                    <BodyText text={email} isBold />
                </View>
                <InputField placeholder="000000"
                    value={code}
                    title={'Code'}
                    onChangeText={(text) => { onCodeChange(text) }}
                    errorText={codeErrorText}
                    keyBoardType='numeric'
                />
                {
                    timerCount > 0 &&
                    <SmallText text={`Renvoyer un code dans ${timerCount} secondes.`} isLeft />
                }
                {
                    timerCount <= 0 &&
                    <TouchableOpacity onPress={() => resendEmailCode()}>
                        <SmallText text='Renvoyer le code' color={Colors.main} isLeft />
                    </TouchableOpacity>
                }
            </View>
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
        paddingTop: 80,
    },
    mailContainer: {
        width: 60,
        height: 60,
        backgroundColor: Colors.veryLightGrey,
        borderRadius: 16,
        borderCurve: 'continuous',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mail: {
        width: 30,
        height: 30,
        tintColor: Colors.main,
    }
})