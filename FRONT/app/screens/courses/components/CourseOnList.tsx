import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import Course from '@/app/models/Course';
import { functions } from '@/app/utils/Functions';
import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
    course: Course;
    isUnlocked: boolean;
    onPress: () => void;
    isRight?: boolean;
}
export default function CourseOnList(props: Props) {



    return (
        <View style={styles.mainContainer}>
            <View style={styles.statsContainer}>
            </View>
            <TouchableOpacity onPress={props.onPress}
                style={[styles.titleContainer,
                {
                    opacity: props.isUnlocked ? 1 : 0.5,
                    elevation: props.isUnlocked ? 10 : 0,
                    alignSelf: props.isRight ? 'flex-end' : 'flex-start',
                }]}
            >
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    zIndex: 1,
                }}>
                    <Image
                        source={
                            props.isUnlocked ?
                                { uri: props.course.base64Icon }
                                :
                                functions.getIconSource('lock')
                        }
                        style={{
                            width: 50,
                            height: 50,
                            tintColor: Colors.main,
                        }} />
                    <Title1 title={props.course.labelFR} color={Colors.white} />

                    <Title1 title={props.isUnlocked ? "70%" : "0%"} color={Colors.main} />
                </View>

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    statsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.black,
        width: Dimensions.get('window').width * 0.6,
        padding: 20,
        gap: 10,
        borderRadius: 16,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
    },
})