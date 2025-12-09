import ProgressBarTime from '@/app/components/molecules/ProgressBarTime';
import Colors from '@/app/constants/Colors';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

type Props = {
    dates: number[];
    currentIndex: number;
}
export default function ChapterHeader(props: Props) {

    return props.dates.length > 0 && (
        <View style={styles.container}>

            <ProgressBarTime dates={props.dates} currentIndex={props.currentIndex} width={Dimensions.get('window').width - 40} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.black,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 20,
        gap: 20,
        zIndex: 10,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
        borderCurve: 'continuous',
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
    }
})