import BodyText from '@/app/components/atoms/BodyText';
import Colors from '@/app/constants/Colors';
import { functions } from '@/app/utils/Functions';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

type Props = {
    onPress: () => void;
    text: string;
    icon: string;
}

export default function MenuItem(props: Props) {
    return (
        <View>
            <TouchableOpacity onPress={props.onPress}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 16,
                    height: 64,
                }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16
                }}>
                    <Image source={functions.getIconSource(props.icon)}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: Colors.darkGrey
                        }} />
                    <BodyText
                        text={props.text} isBold />
                </View>

                <Image source={functions.getIconSource('arrow-right0')}
                    style={{
                        width: 16,
                        height: 16,
                        tintColor: Colors.darkGrey
                    }} />

            </TouchableOpacity>
        </View>
    )
}