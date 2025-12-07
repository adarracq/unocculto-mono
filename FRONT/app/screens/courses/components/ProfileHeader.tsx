import BodyText from '@/app/components/atoms/BodyText';
import Title0 from '@/app/components/atoms/Title0';
import ProgressBarLvl from '@/app/components/molecules/ProgressBarLvl';
import Avatars from '@/app/constants/Avatars';
import Colors from '@/app/constants/Colors';
import User from '@/app/models/User';
import { functions } from '@/app/utils/Functions';
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
        <View style={styles.container}>
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
                        source={functions.getIconSource('gem')}
                        style={{ width: 24, height: 24 }}
                    />
                    <BodyText
                        text={props.user.gems + ''}
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
            <ProgressBarLvl lvl={2} xpCurrent={60} xpTotal={100} width={Dimensions.get('window').width * 0.7} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
        gap: 20
    },
    avatarContainer: {
        width: 160,
        height: 160,
        borderRadius: 200,
        marginTop: -50,
        backgroundColor: Colors.black,
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
        backgroundColor: Colors.black,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
    }
})