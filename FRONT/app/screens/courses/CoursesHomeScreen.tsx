import BodyText from '@/app/components/atoms/BodyText';
import ButtonGradient from '@/app/components/atoms/ButtonGradient';
import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { useApi } from '@/app/hooks/useApi';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { userService } from '@/app/services/user.service';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import ProfileHeader from './components/ProfileHeader';

type Props = NativeStackScreenProps<CoursesNavParams, 'Home'>;

export default function CoursesHomeScreen({ navigation, route }: Props) {
    const [userContext, setUserContext] = useContext(UserContext);
    const isFocused = useIsFocused();

    // Utilisation du hook useApi pour gérer les appels avec gestion d'erreur centralisée
    const userApi = useApi(
        () => userService.getByEmail(userContext.email),
        'ProfileScreen - GetUser'
    );

    const { execute: updateUserAvatar, loading } = useApi(
        (userData: any) => userService.update(userData),
        'ProfileScreen - updateUser'
    );

    const handleChangeAvatar = async (newAvatarID: number) => {
        if (!userApi.data) return;

        const updatedUser = {
            ...userApi.data,
            avatarID: newAvatarID
        };

        const result = await updateUserAvatar({ user: updatedUser });

        if (result) {
            // Met à jour les données utilisateur dans le contexte
            setUserContext({
                ...userContext,
                avatarID: newAvatarID
            });
        }
    };

    const refreshUserData = async () => {
        if (!userContext?.email) {
            userApi.setData(null);
            return;
        }
        await userApi.execute();
    };

    useEffect(() => {
        refreshUserData();
    }, [isFocused]);

    // Affichage de l'écran de chargement
    if (userApi.loading) {
        return <View style={styles.container}>
            <LoadingScreen />
        </View>;
    }

    // Vérification des données utilisateur
    if (!userApi.data) {
        return (
            <View style={styles.container}>
                <BodyText
                    text="Impossible de charger les données utilisateur"
                    color={Colors.darkGrey}
                    style={{ alignSelf: 'center', marginTop: 20 }}
                />
            </View>
        );
    }

    return userApi.data && (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <ProfileHeader
                user={userApi.data}
                onChangeAvatar={handleChangeAvatar}
            />
            <View style={{ gap: 32 }}>
                <ButtonGradient
                    title="Voyage complet"
                    onPress={() => navigation.navigate('CoursesList', { user: userApi.data! })}
                    color1={Colors.mainDark}
                    color2={Colors.mainLight}
                    icon={'journey'}
                    iconColor={Colors.white}
                    textColor={Colors.white}
                    recommended
                />
                <ButtonGradient
                    title="Exploration libre"
                    onPress={() => navigation.navigate('CoursesList', { user: userApi.data! })}
                    color1={Colors.mainDark}
                    color2={Colors.mainLight}
                    icon={'rocket'}
                    iconColor={Colors.white}
                    textColor={Colors.white}
                />
                <ButtonGradient
                    title="DEV"
                    onPress={() => navigation.navigate('Dev')}
                    color1={Colors.mainDark}
                    color2={Colors.mainLight}
                    icon={'rocket'}
                    iconColor={Colors.white}
                    textColor={Colors.white}
                />
            </View>
            <View></View>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
})