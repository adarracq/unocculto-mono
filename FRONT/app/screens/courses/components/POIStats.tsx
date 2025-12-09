import Title1 from '@/app/components/atoms/Title1';
import Title2 from '@/app/components/atoms/Title2';
import Colors from '@/app/constants/Colors';
import Theme from '@/app/models/Theme';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

type Props = {
    stats: { completed: number, total: number, themeID: string }[];
    themes: Theme[];
}

export default function POIStats(props: Props) {

    function showStat(index: number) {
        showMessage({
            message: props.themes.find(t => t._id === props.stats[index].themeID)?.labelFR || "",
            description: "Points d'intérêt complétés : " + props.stats[index].completed + " / " + props.stats[index].total,
            type: 'info',
            duration: 5000,
        });
    }

    return (
        <View style={styles.container}>
            {
                props.stats.map((stat, index) => (

                    stat.total > 0 &&
                    <TouchableOpacity
                        onPress={() => showStat(index)}
                        key={index}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end'
                        }}>
                        <Image source={{ uri: props.themes.find(t => t._id === stat.themeID)?.base64Icon }}
                            style={{
                                width: 40,
                                height: 40,
                                marginRight: 10
                            }} />
                        <Title1 title={stat.completed.toString()} color={Colors.white} />
                        <Title2 title={'/' + stat.total.toString()} color={Colors.lightGrey} style={{ fontFamily: 'title-regular' }} />

                    </TouchableOpacity>

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