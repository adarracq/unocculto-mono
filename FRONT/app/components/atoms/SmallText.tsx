import React from 'react';
import { Text, TextStyle } from 'react-native';
import Colors from '../../constants/Colors';

type SmallTextProps = {
    text: string;
    color?: any;
    isLeft?: boolean;
    isBold?: boolean;
    isItalic?: boolean;
    style?: TextStyle;
}

export default function SmallText(props: SmallTextProps) {
    return (
        <Text style={[{
            fontSize: 12,
            textAlign: props.isLeft ? 'left' : 'center',
            fontFamily: props.isItalic ? 'text-italic' : props.isBold ? 'text-bold' : 'text-regular',
            color: props.color ? props.color : Colors.lightGrey,
        }, props.style]}>{props.text}</Text>
    )
}