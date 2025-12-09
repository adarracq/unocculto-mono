import Avatars from '@/app/constants/Avatars';
import Colors from '@/app/constants/Colors';
import { functions } from '@/app/utils/Functions';
import React, { useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { ScrollView } from 'react-native-gesture-handler';

type DropDownProps = {
    unlockedAvatarIDs: number[];
    selectedAvatarID: number;
    onChangeAvatar: (id: number) => void;
}

export default function DropDownAvatar(props: DropDownProps) {

    const actionSheetRef = useRef<ActionSheetRef>(null);

    const [avatars, setAvatars] = useState(Avatars.avatars);

    function setAvailableAvatars() {
        const updatedAvatars = avatars.map(avatar => ({
            ...avatar,
            unlocked: props.unlockedAvatarIDs?.includes(avatar.id) || false
        }));
        setAvatars(updatedAvatars);
    }

    useEffect(() => {
        setAvailableAvatars();
    }, [props.unlockedAvatarIDs]);

    return (
        <>
            <TouchableOpacity onPress={() => actionSheetRef.current?.show()}
                style={{
                    borderRadius: 16,
                    borderCurve: 'continuous',
                    backgroundColor: Colors.white,
                    padding: 8,
                }}
            >
                <Image
                    source={functions.getIconSource('change')}
                    style={{
                        width: 24,
                        height: 24,
                        alignSelf: 'center',
                        tintColor: Colors.main
                    }}
                />
            </TouchableOpacity>
            <ActionSheet ref={actionSheetRef}
                containerStyle={{
                    borderTopLeftRadius: 35,
                    borderTopRightRadius: 35,
                    backgroundColor: Colors.black,
                }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingTop: 35, gap: 20 }}>
                    {
                        avatars.map((item, index) => (
                            index % 3 === 0 && (
                                <View key={`row-${index}`} style={{ flexDirection: 'row', gap: 20, paddingHorizontal: 16 }}>
                                    {avatars.slice(index, index + 3).map((avatar) => (
                                        <TouchableOpacity
                                            key={avatar.id}
                                            onPress={() => {
                                                if (avatar.unlocked) {
                                                    props.onChangeAvatar(avatar.id);
                                                    actionSheetRef.current?.hide();
                                                }
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: 10,
                                                backgroundColor: props.selectedAvatarID === avatar.id ?
                                                    Colors.white : !avatar.unlocked ? Colors.darkGrey : Colors.veryLightGrey,
                                                borderRadius: 16,
                                                borderCurve: 'continuous',
                                                borderWidth: props.selectedAvatarID === avatar.id ? 2 : 0,
                                                borderColor: Colors.main,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                shadowColor: "#000000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 3,
                                                },
                                                shadowOpacity: 0.17,
                                                shadowRadius: 3.05,
                                                elevation: !avatar.unlocked ? 0 : 10
                                            }}
                                        >
                                            <Image
                                                source={functions.getAvatarSource(avatar.icon)}
                                                style={{
                                                    width: '100%',
                                                    height: undefined,
                                                    aspectRatio: 1,
                                                    opacity: avatar.unlocked ? 1 : 0.2,
                                                }}
                                            />
                                            {
                                                !avatar.unlocked && (
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Image
                                                            source={functions.getIconSource('lock')}
                                                            style={{ width: 40, height: 40 }}
                                                        />
                                                    </View>
                                                )
                                            }
                                            {
                                                props.selectedAvatarID === avatar.id && (
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: -15,
                                                        right: -15,
                                                    }}>
                                                        <Image
                                                            source={functions.getIconSource('check')}
                                                            style={{ width: 40, height: 40, tintColor: Colors.main }}
                                                        />
                                                    </View>
                                                )
                                            }
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )
                        ))
                    }
                </ScrollView>
            </ActionSheet >
        </>
    )
}