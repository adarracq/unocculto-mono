import Colors from '@/app/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import Title1 from '../atoms/Title1';
import Title2 from '../atoms/Title2';

type ProgressBarLvlProps = {
    lvl: number;
    xpCurrent: number;
    xpTotal: number;
    width: number;
}
export default function ProgressBarLvl(props: ProgressBarLvlProps) {
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
                alignItems: 'flex-end'
            }}>
                <Title1 title={'Niveau ' + props.lvl} color={Colors.white} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
                    <Title1 title={props.xpCurrent.toString()} color={Colors.white} />
                    <Title2 title={'/' + props.xpTotal} color={Colors.lightGrey} style={{ fontFamily: 'title-regular' }} />
                    <Title2 title={' XP'} color={Colors.lightGrey} style={{ fontFamily: 'title-regular' }} />
                </View>
            </View>
            <Progress.Bar
                progress={props.xpCurrent / props.xpTotal}
                width={props.width}
                height={8}
                color={Colors.white}
                unfilledColor={Colors.lightGrey}
                borderWidth={0}
                borderRadius={4}
            />
        </View>
    )
}