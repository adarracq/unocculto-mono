import BodyText from '@/app/components/atoms/BodyText';
import Button from '@/app/components/atoms/Button';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import POI from '@/app/models/POI';
import { functions } from '@/app/utils/Functions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
    selectedPoi: POI;
    onNavigateToCourse: (poi: POI) => void;
    onClose: () => void;
}
export default function POIInfoCard(props: Props) {

    return (
        <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
                <Title1
                    style={{ maxWidth: '90%' }}
                    title={props.selectedPoi.labelFR}
                />

                <TouchableOpacity onPress={() => props.onClose()}>
                    <Image
                        source={functions.getIconSource('close')}
                        style={{
                            width: 24,
                            height: 24,
                            tintColor: Colors.lightGrey,
                        }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'column', gap: 20 }}>
                <View style={{ height: 1, backgroundColor: Colors.darkGrey }} />
                <View style={styles.dateBadge}>
                    <Ionicons name="time-outline" size={16} color={Colors.main} />
                    <BodyText text={functions.dateToString(props.selectedPoi.dateStart)} />
                </View>

                <BodyText
                    nbLines={3}
                    text={props.selectedPoi.content.intro}
                    color={Colors.lightGrey}
                />
                <Button
                    title="Voir le cours"
                    backgroundColor={Colors.main}
                    textColor={Colors.white}
                    onPress={() => props.onNavigateToCourse(props.selectedPoi)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    infoCard: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        backgroundColor: Colors.black + 'DD',
        borderRadius: 16,
        borderCurve: 'continuous',
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.darkGrey,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderCurve: 'continuous',
        alignSelf: 'flex-start'
    },
});