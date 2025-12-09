import Colors from '@/app/constants/Colors';
import React from 'react';
import { Text, TextStyle } from 'react-native';

type BodyTextProps = {
    text: string;
    nbLines?: number;
    style?: TextStyle;
    color?: string;
    isItalic?: boolean;
    isBold?: boolean;
    isMedium?: boolean;
    centered?: boolean;
}

export default function BodyText(props: BodyTextProps) {
    return (
        <Text numberOfLines={props.nbLines}
            style={[{
                fontSize: 15,
                color: props.color ? props.color : Colors.white,
                textAlign: props.centered ? 'center' : 'left',
                fontFamily: props.isItalic ? 'text-italic' : props.isBold ? 'text-bold' : props.isMedium ? 'text-medium' : 'text-regular',
            }, props.style]}>
            {props.text}
        </Text>
    )
}