import BodyText from '@/app/components/atoms/BodyText';
import Colors from '@/app/constants/Colors';
import Theme from '@/app/models/Theme';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
    stats: { completed: number, total: number, themeID: string }[];
    themes: Theme[];
}

export default function POIStats(props: Props) {

    return (
        <View style={styles.container}>
            {
                props.stats.map((stat, index) => (
                    <View key={index} style={{
                        flexDirection: 'row',
                    }}>
                        <Image source={{ uri: props.themes.find(t => t._id === stat.themeID)?.base64Icon }}
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 10
                            }} />
                        <BodyText text={stat.completed + " / " + stat.total} color={Colors.white} />
                    </View>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
})