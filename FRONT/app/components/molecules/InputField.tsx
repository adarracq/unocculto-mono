import { functions } from '@/app/utils/Functions';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import SmallText from '../atoms/SmallText';

type InputFieldProps = {
    placeholder: string;
    value: string;
    title: string;
    onChangeText: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    dateInput?: boolean;
    errorText?: string | null;
    keyBoardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'number-pad';
    isMultiline?: boolean;
    height?: number;
    style?: ViewStyle;
    isCreditCard?: boolean;
    noTitle?: boolean;
    noKeyboard?: boolean;
    maxLength?: number;
}

export default function InputField(props: InputFieldProps) {

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const onFocus = () => {
        setIsFocused(true);
        if (props.onFocus) {
            props.onFocus();
        }
    }

    const onBlur = () => {
        setIsFocused(false);
        if (props.onBlur) {
            props.onBlur();
        }
    }

    if (props.dateInput && inputRef.current) {
        inputRef.current.blur();
    }


    return (
        <View>
            <View
                style={[{
                    width: '100%',
                    height: props.height || 70,
                    borderColor: props.errorText ? Colors.red : isFocused ? Colors.main : Colors.lightGrey,
                    borderWidth: isFocused || props.errorText ? 2 : 1,
                    borderRadius: 16,
                    borderCurve: 'continuous',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: Colors.white,
                }, props.style]}
            >
                {!props.noTitle &&
                    <SmallText
                        text={props.title}
                        color={isFocused ? Colors.main : Colors.darkGrey}
                        isLeft
                    />
                }
                <TextInput
                    ref={inputRef}
                    style={{
                        fontFamily: props.value ? 'text-bold' : 'text-regular',
                        fontSize: 16,
                        textAlignVertical: props.isMultiline ? 'top' : 'center',
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChangeText={props.onChangeText}
                    value={props.value}
                    placeholder={props.placeholder}
                    placeholderTextColor={Colors.lightGrey}
                    keyboardType={props.keyBoardType || 'default'}
                    multiline={props.isMultiline}
                    showSoftInputOnFocus={!props.noKeyboard}
                    maxLength={props.maxLength ? props.maxLength : 10000}
                />
                {
                    props.isCreditCard &&
                    <Image
                        source={functions.getIconSource('payments')}
                        style={styles.payments}
                    />
                }
            </View>
            {props.errorText && <SmallText text={props.errorText} color={Colors.red} />}
        </View>
    )
}
const styles = StyleSheet.create({
    payments: {
        height: 20,
        width: 113,
        position: 'absolute',
        right: 16,
        top: 20,
    }
})