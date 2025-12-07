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
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';


type Props = NativeStackScreenProps<NavParams, 'ChoosePseudo'>;
export default function ChoosePseudoScreen({ navigation, route }: Props) {

    const [pseudo, setPseudo] = useState('');
    const [pseudoErrorText, setPseudoErrorText] = useState<string | null>(null);

    const { execute: testPseudoValidity, loading } = useApi(
        (pseudo: string) => userService.testPseudoValidity(pseudo),
        'ChoosePseudoScreen - testPseudoValidity'
    );

    function onPseudoChange(text: string) {

        setPseudo(text);

        if (!text || text === '') {
            setPseudoErrorText('Veuillez entrer un pseudo');
        }
        else if (!/^[a-zA-Z0-9_]+$/.test(text)) {
            setPseudoErrorText('Veuillez entrer un pseudo valide');
        }
        else if (text.length < 3 || text.length > 20) {
            setPseudoErrorText('Le pseudo doit contenir entre 3 et 20 caractères');
        }
        else {
            setPseudoErrorText(null);
        }
    }

    const next = async () => {
        // if no input we show an error
        if (!pseudo || pseudo === '') {
            showMessage({
                message: 'Erreur',
                description: 'Veuillez entrer un pseudo',
                type: 'danger',
            })
            setPseudoErrorText('Veuillez entrer un pseudo');
            return;
        }

        // if email not valid we show an error
        if (pseudoErrorText) {
            showMessage({
                message: 'Erreur',
                description: pseudoErrorText,
                type: 'danger',
            });
            return;
        }

        setPseudoErrorText(null);

        const result = await testPseudoValidity(pseudo);
        if (result) {
            if (result.available) {
                navigation.navigate('SetThemes', { user: { ...route.params.user, pseudo } });
            }
            else {
                showMessage({
                    message: 'Erreur',
                    description: 'Ce pseudo est déjà pris',
                    type: 'warning',
                });
                setPseudoErrorText('Ce pseudo est déjà pris');
                setPseudo('');
            }
        }
    }

    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <BackArrow onPress={() => navigation.goBack()} />
            <View style={{ gap: 24 }}>
                <ProgressBar progress={2} total={4} title="E-mail" width={80} />
                <Title0 title={'Choisissez un pseudo'} color={Colors.white} />
                <InputField placeholder="Entrez votre pseudo"
                    value={pseudo}
                    title={'Pseudo'}
                    onChangeText={(text) => { onPseudoChange(text) }}
                    errorText={pseudoErrorText}
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