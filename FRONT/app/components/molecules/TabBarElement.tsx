import { functions } from '@/app/utils/Functions';
import React from 'react';
import { Image, View } from 'react-native';
import Colors from '../../constants/Colors';
import SmallText from '../atoms/SmallText';

type TabBarElementProps = {
    title: string;
    focused: boolean;
    name: string;
    nbNotifications?: number;
}

export default function TabBarElement(props: TabBarElementProps) {

    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
            height: 60,
            marginTop: 30,
        }}>
            {/* Cercle gris extérieur */}
            <View style={{
                width: 55,
                height: 55,
                borderRadius: 27.5,
                backgroundColor: props.focused ? Colors.lightGrey : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {/* Cercle blanc intérieur */}
                <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: props.focused ? Colors.white : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image
                        source={functions.getIconSource(props.name)}
                        style={{
                            width: props.focused ? 40 : 32,
                            height: props.focused ? 40 : 32,
                            tintColor: props.focused ? Colors.main : Colors.lightGrey
                        }}
                    />
                </View>
            </View>

            {props.nbNotifications && props.nbNotifications > 0 ?
                <View style={{
                    position: 'absolute',
                    right: 5,
                    top: 0,
                    backgroundColor: Colors.red,
                    borderColor: Colors.white,
                    borderWidth: 2,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <SmallText text={props.nbNotifications.toString()} color={Colors.white} />
                </View>
                : null
            }
        </View>

    )
}
