import BodyText from '@/app/components/atoms/BodyText';
import Title0 from '@/app/components/atoms/Title0';
import ProgressBarLvl from '@/app/components/molecules/ProgressBarLvl';
import Avatars from '@/app/constants/Avatars';
import Colors from '@/app/constants/Colors';
import User from '@/app/models/User';
import { functions } from '@/app/utils/Functions';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import DropDownAvatar from './DropDownAvatar';

type Props = {
    user: User;
    onChangeAvatar: (id: number) => void;
}
export default function ProfileHeader(props: Props) {

    const [avatarID, setAvatarID] = useState<number>(props.user.avatarID || 0);

    return (
        <LinearGradient
            colors={[Colors.black, Colors.realBlack,]}
            style={styles.container}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                <View style={styles.valueContainer}>
                    <Image
                        source={functions.getIconSource('fire')}
                        style={{ width: 24, height: 24 }}
                    />
                    <BodyText
                        text={props.user.dayStreak + ''}
                        isBold
                    />
                </View>
                <View style={styles.valueContainer}>
                    <Image
                        source={functions.getIconSource('lightning')}
                        style={{ width: 24, height: 24 }}
                    />
                    <BodyText
                        text={props.user.lifes?.toString() || '0'}
                        isBold
                    />
                </View>
            </View>
            <View style={styles.avatarContainer} >
                <Image
                    style={styles.avatar}
                    source={functions.getAvatarSource(Avatars.avatars[avatarID].icon)}
                />
                <View style={styles.dropDownContainer}>
                    <DropDownAvatar
                        unlockedAvatarIDs={props.user.unlockedAvatarIDs || []}
                        selectedAvatarID={avatarID}
                        onChangeAvatar={(id: number) => {
                            setAvatarID(id);
                            props.onChangeAvatar(id);

                        }}
                    />
                </View>
            </View>

            <Title0
                title={props.user.pseudo || 'XXX'}
            />
            <ProgressBarLvl coins={props.user.coins} width={Dimensions.get('window').width - 40} />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
        gap: 20,
        backgroundColor: Colors.black,
        padding: 20,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderCurve: 'continuous',
        // Ombre subtile et diffuse (Glow effect) pour le mode sombre
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarContainer: {
        width: 160,
        height: 160,
        borderRadius: 160,
        borderCurve: 'continuous',
        marginTop: -50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    dropDownContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderCurve: 'continuous',
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.darkGrey,
        backgroundColor: Colors.realBlack + '22'
    }
})