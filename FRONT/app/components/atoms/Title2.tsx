import React from 'react';
import { Text, TextStyle } from 'react-native';
import Colors from '../../constants/Colors';

type Title2Props = {
    title: string;
    color?: any;
    style?: TextStyle;
    isLeft?: boolean;
}

export default function Title2(props: Title2Props) {
    return (
        <Text style={[{
            color: props.color ? props.color : Colors.white,
            fontSize: 16,
            textAlign: props.isLeft ? 'left' : 'center',
            fontFamily: 'title-bold',
        }, props.style]}>{props.title}</Text>
    )
}