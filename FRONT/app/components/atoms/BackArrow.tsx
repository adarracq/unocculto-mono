import Colors from '@/app/constants/Colors';
import { functions } from '@/app/utils/Functions';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

type Props = {
    onPress: () => void;
}
export default function BackArrow(props: Props) {

    return (
        <TouchableOpacity onPress={props.onPress} style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, padding: 20 }}>
            <Image source={functions.getIconSource('arrow-left')} style={{ width: 25, height: 25, tintColor: Colors.white }} />
        </TouchableOpacity>
    )
}