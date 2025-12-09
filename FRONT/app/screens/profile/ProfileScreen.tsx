import BodyText from '@/app/components/atoms/BodyText';
import SmallText from '@/app/components/atoms/SmallText';
import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { useApi } from '@/app/hooks/useApi';
import { ProfileNavParams } from '@/app/navigations/ProfileNav';
import { userService } from '@/app/services/user.service';
import AsyncStorageUser from '@/app/utils/AsyncStorageUser';
import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<ProfileNavParams, 'HomeProfile'>;

export default function ProfileScreen({ navigation, route }: Props) {
    const [user, setUser] = useContext(UserContext);
    const isFocused = useIsFocused();

    // Utilisation du hook useApi pour gérer les appels avec gestion d'erreur centralisée
    const userApi = useApi(
        () => userService.getByEmail(user.email),
        'ProfileScreen - GetUser'
    );

    const deleteAccountApi = useApi(
        (userId: string) => userService.deleteAccountAndData(userId),
        'ProfileScreen - DeleteAccount'
    );

    const refreshUserData = async () => {
        if (!user) {
            userApi.setData(null);
            return;
        }
        await userApi.execute();
    };

    function logout() {
        Alert.alert(
            'Déconnexion',
            'Voulez-vous vraiment vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Oui', onPress: () => {
                        AsyncStorageUser.Logout();
                        setUser(null);
                        userApi.setData(null);
                    }
                }
            ]
        );
    }

    function deleteAccount() {
        Alert.alert(
            'Suppression du compte',
            'Voulez-vous vraiment supprimer votre compte ?\nCette action est irréversible.',
            [
                {
                    text: 'Annuler',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Oui', onPress: async () => {
                        if (!userApi.data || !userApi.data._id) return;

                        const result = await deleteAccountApi.execute(userApi.data._id);
                        if (result) {
                            AsyncStorageUser.Logout();
                            setUser(null);
                            userApi.setData(null);
                        }
                    }
                }
            ]
        );
    }


    useEffect(() => {
        refreshUserData();
    }, [isFocused]);

    // Affichage de l'écran de chargement
    if (userApi.loading || deleteAccountApi.loading) {
        return <LoadingScreen />;
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
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity
                    onPress={logout}
                >
                    <BodyText text="Déconnexion" color={Colors.red} style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={deleteAccount}
                >
                    <BodyText text="Supprimer votre compte" color={Colors.red} style={{ alignSelf: 'center', paddingVertical: 30 }} />
                </TouchableOpacity>
                <SmallText text="Version 1.4.4" color={Colors.lightGrey} style={{ alignSelf: 'center' }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: 50,
    },
    scrollContainer: {
        gap: 32,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 120,
        minHeight: '100%',
    },
    menuContainer: {
        borderRadius: 16,
        borderCurve: 'continuous',
        borderColor: Colors.lightGrey,
        borderWidth: 1,
        backgroundColor: Colors.white,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    divider: {
        borderBottomColor: Colors.lightGrey,
        borderBottomWidth: 1,
    }
})