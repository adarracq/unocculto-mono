import React from 'react';
import { Text, TextStyle } from 'react-native';
import Colors from '../../constants/Colors';

type Title1Props = {
    title: string;
    color?: any;
    style?: TextStyle;
    isLeft?: boolean;
    isRight?: boolean;
}

export default function Title1(props: Title1Props) {
    return (
        <Text style={[{
            color: props.color ? props.color : Colors.white,
            fontSize: 18,
            textAlign: props.isLeft ? 'left' : props.isRight ? 'right' : 'center',
            fontFamily: 'title-bold',
        }, props.style]}>{props.title}</Text>
    )
}