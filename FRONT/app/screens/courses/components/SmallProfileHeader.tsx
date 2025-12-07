import BodyText from '@/app/components/atoms/BodyText';
import ProgressBarLvl from '@/app/components/molecules/ProgressBarLvl';
import Colors from '@/app/constants/Colors';
import User from '@/app/models/User';
import { functions } from '@/app/utils/Functions';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

type Props = {
    user: User;
}
export default function SmallProfileHeader(props: Props) {

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
                        color={Colors.black}
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
                        color={Colors.black}
                    />
                </View>
            </View>
            <ProgressBarLvl lvl={2} xpCurrent={60} xpTotal={100} width={Dimensions.get('window').width - 40} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: Colors.black,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 20,
        gap: 20
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
    }
})