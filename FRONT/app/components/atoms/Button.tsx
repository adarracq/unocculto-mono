import { functions } from '@/app/utils/Functions';
import React from 'react';
import { Image, TouchableOpacity, View, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import Title2 from './Title2';

type ButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor: any;
  icon?: any;
  iconColor?: any;
  textColor?: any;
  noShadow?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  recommended?: boolean;
  gradient?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={props.disabled ? () => { } : props.onPress}
      style={[{
        borderRadius: 16,
        height: 54,
        width: '100%',
        backgroundColor: props.disabled ? Colors.lightGrey : props.backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: props.noShadow ? 0 : 4
      }, props.style]}>
      {
        props.icon &&
        <Image
          source={functions.getIconSource(props.icon)}
          style={{
            width: 24,
            height: 24,
            tintColor: props.disabled ? Colors.white : props.iconColor ? props.iconColor : null,
            position: 'absolute',
            left: 20
          }} />
      }

      <Title2 title={props.title} color={props.disabled ? Colors.white : props.textColor ? props.textColor : Colors.black} />


      {
        props.recommended &&
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          position: 'absolute',
          top: -10,
          right: 30,
          backgroundColor: Colors.white,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 16,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          elevation: 10
        }}>
          <Image
            source={functions.getIconSource('check')}
            style={{
              width: 24,
              height: 24,
              tintColor: Colors.purple,
            }} />
          <Title2 title="Recommandé" color={Colors.purple} />
        </View>
      }

    </TouchableOpacity>
  )
}