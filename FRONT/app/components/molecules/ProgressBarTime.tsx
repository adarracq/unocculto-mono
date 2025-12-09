import Colors from '@/app/constants/Colors';
import { functions } from '@/app/utils/Functions';
import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import Title1 from '../atoms/Title1';
import Title2 from '../atoms/Title2';

type ProgressBarLvlProps = {
    dates: number[];
    currentIndex: number;
    width: number;
}
export default function ProgressBarTime(props: ProgressBarLvlProps) {

    // Vérifications de sécurité
    if (!props.dates || props.dates.length === 0) {
        return null;
    }

    function calculateProgress(date: number) {
        if (!date || !props.dates || props.dates.length === 0) return 0;
        if (date > props.dates[props.dates.length - 1]) return 1;

        // totale scale = modulo(fistDate - lastDate)
        let totalScale = Math.abs(props.dates[props.dates.length - 1] - props.dates[0]);
        if (totalScale === 0) return 0;

        let scale = Math.abs(date - props.dates[0]);
        return scale / totalScale;
    }

    // S'assurer que currentIndex est dans les limites
    const safeCurrentIndex = Math.min(Math.max(0, props.currentIndex), props.dates.length - 1);
    const currentDate = props.dates[safeCurrentIndex];

    if (!currentDate) {
        return null;
    }

    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: props.width,
                height: 25,
                alignItems: 'flex-end'
            }}>
                <Title1 title={functions.simpleDateToString(props.dates[0])} color={Colors.white} />
                <Title2 title={functions.simpleDateToString(props.dates[props.dates.length - 1])} color={Colors.white} />
            </View>
            <Progress.Bar
                progress={calculateProgress(currentDate)}
                width={props.width}
                height={8}
                color={Colors.main}
                unfilledColor={Colors.lightGrey}
                borderWidth={0}
                borderRadius={4}
                animated
            />
            <Title1
                title={functions.dateToString(currentDate)}
                color={Colors.main}
                style={{
                }}
            />
            <View style={{
                position: 'absolute',
                left: Math.min(Math.max(0, (props.width - 16) * calculateProgress(currentDate)), props.width - 16),
                top: 28,
            }}>
                <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 16,
                    borderCurve: 'continuous',
                    backgroundColor: Colors.main,
                    borderWidth: 2,
                    borderColor: Colors.white,
                }} />
            </View>
        </View>
    )
}