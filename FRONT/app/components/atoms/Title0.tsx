import React from 'react';
import { Text, TextStyle } from 'react-native';
import Colors from '../../constants/Colors';

type Title0Props = {
    title: string;
    color?: any;
    style?: TextStyle;
    isLeft?: boolean;
    crossed?: boolean;
}

export default function Title0(props: Title0Props) {
    return (
        <Text style={[{
            color: props.color ? props.color : Colors.white,
            fontSize: 28,
            textAlign: props.isLeft ? 'left' : 'center',
            fontFamily: 'title-bold',
            textDecorationLine: props.crossed ? 'line-through' : 'none'
        }, props.style]}>{props.title}</Text>
    )
}