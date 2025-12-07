import { functions } from '@/app/utils/Functions';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import BodyText from '../atoms/BodyText';

type CheckBoxProps = {
  title: string;
  onPress: () => void;
  selected: boolean;
  icon: string;
  base64?: boolean;
}

export default function CheckBox(props: CheckBoxProps) {
  return (
    <TouchableOpacity onPress={props.onPress}
      style={[styles.container, {
        borderColor: props.selected ? Colors.mainLight : Colors.lightGrey,
        borderWidth: props.selected ? 2 : 1,
        backgroundColor: props.selected ? Colors.lightOrange : Colors.white
      }]}>

      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>

        <Image
          source={props.base64 ? { uri: props.icon } : functions.getIconSource(props.icon)}
          style={{ width: 20, height: 20 }}
        />

        <View style={{ alignItems: 'flex-start' }}>
          <BodyText text={props.title} isMedium color={Colors.black} />
        </View>
      </View>

      {
        props.selected ?
          <MaterialCommunityIcons name="checkbox-marked" size={20} color={Colors.mainLight} />
          :
          <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color={Colors.lightGrey} />

      }

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    height: 50,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  containerSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    height: 50,
    borderRadius: 16,
    backgroundColor: Colors.white,

    borderWidth: 2,
    borderColor: Colors.mainLight,

  }

})