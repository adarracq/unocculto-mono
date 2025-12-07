import Colors from '@/app/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import Title2 from '../atoms/Title2';

type ProgressBarProps = {
    progress: number;
    total: number;
    title?: string;
    width: number;
}
export default function ProgressBar(props: ProgressBarProps) {
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
        }}>
            {
                props.title && <Title2 title={props.title} />
            }
            <Progress.Bar
                progress={props.progress / props.total}
                width={props.width}
                color={Colors.main}
                unfilledColor={Colors.lightGrey}
                borderWidth={0}
            />
        </View>
    )
}