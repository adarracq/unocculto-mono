import BodyText from '@/app/components/atoms/BodyText';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import Entity from '@/app/models/Entity';
import { functions } from '@/app/utils/Functions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
    selectedEntity: Entity;
    onClose: () => void;
}
export default function EntityInfoCard(props: Props) {

    const date = functions.simpleDateToString(props.selectedEntity.dateStart) + (props.selectedEntity.dateEnd ? ` / ${functions.simpleDateToString(props.selectedEntity.dateEnd)}` : '');

    return (
        <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
                <Title1
                    style={{ maxWidth: '90%' }}
                    title={props.selectedEntity.labelFR}
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
                    <BodyText text={date} />
                </View>

                <BodyText
                    nbLines={3}
                    text={props.selectedEntity.descriptionMarkDownFR}
                    color={Colors.lightGrey}
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