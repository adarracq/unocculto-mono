import BackArrow from '@/app/components/atoms/BackArrow';
import BodyText from '@/app/components/atoms/BodyText';
import Button from '@/app/components/atoms/Button';
import Title0 from '@/app/components/atoms/Title0';
import CheckBox from '@/app/components/molecules/Checkbox';
import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import ProgressBar from '@/app/components/molecules/ProgressBar';
import Colors from '@/app/constants/Colors';
import { useApi } from '@/app/hooks/useApi';
import Theme from '@/app/models/Theme';
import { NavParams } from '@/app/navigations/UnloggedNav';
import { themeService } from '@/app/services/theme.service';
import { userService } from '@/app/services/user.service';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<NavParams, 'SetThemes'>;
export default function SetThemesScreen({ navigation, route }: Props) {

    const [themes, setThemes] = useState<{ theme: Theme, selected: boolean }[]>([]);

    const { execute: updateUser, loading: loadingUser } = useApi(
        (userData: any) => userService.update(userData),
        'SetThemesScreen - updateUser'
    );

    const { execute: getThemes, loading: loadingThemes } = useApi(
        () => themeService.getAll(),
        'SetThemesScreen - getThemes'
    );

    async function fetchThemes() {
        const result = await getThemes();
        if (result) {
            setThemes(result.map((theme: any) => ({ theme, selected: true })));
        }
    }

    function changeTheme(name: string) {
        setThemes(themes.map((theme) => theme.theme.name === name ? { ...theme, selected: !theme.selected } : theme));
    }

    const next = async () => {
        let updatedUser = { ...route.params.user };
        updatedUser.themes = themes.filter(theme => theme.selected).map(theme => theme.theme.name);

        const result = await updateUser({ user: updatedUser });
        if (result) {
            navigation.navigate('AccountCreated', { user: updatedUser });
        }
    }

    useEffect(() => {
        fetchThemes();
    }, []);

    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]} style={styles.container}>
            <BackArrow onPress={() => navigation.goBack()} />
            <View style={{ gap: 24 }}>
                <ProgressBar progress={3} total={4} title="Thèmes" width={80}
                />
                <Title0 title={'Quel(s) thème(s) vous intéressent ?'} isLeft style={{ padding: 20 }} />
            </View>
            <BodyText isItalic style={{ paddingHorizontal: 20 }}
                text="Vous pourrez modifier vos préférences à tout moment dans les paramètres de l'application." />
            <ScrollView contentContainerStyle={{ gap: 16, paddingVertical: 30, paddingHorizontal: 20 }}>
                {
                    themes.map((theme, index) => (
                        <CheckBox
                            key={index}
                            title={theme.theme.labelFR}
                            onPress={() => changeTheme(theme.theme.name)}
                            selected={theme.selected}
                            base64
                            icon={theme.theme.base64Icon}
                        />
                    ))
                }
            </ScrollView>
            <View style={{ padding: 20, paddingTop: 0 }} >
                <Button title="Suivant"
                    backgroundColor={Colors.white}
                    textColor={Colors.black}
                    onPress={next} />
            </View>

            {
                (loadingUser || loadingThemes) && <LoadingScreen />
            }
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 50,
    },
})