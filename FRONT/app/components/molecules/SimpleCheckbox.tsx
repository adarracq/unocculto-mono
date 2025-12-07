import { functions } from '@/app/utils/Functions';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import BodyText from '../atoms/BodyText';

type Props = {
  title: string;
  icon?: string;
  onPress: () => void;
  selected: boolean;
}

export default function SimpleCheckbox(props: Props) {
  return (
    <TouchableOpacity onPress={props.onPress}
      style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {
          props.icon &&
          <Image source={functions.getIconSource(props.icon)} style={{ width: 20, height: 20 }} />
        }
        <BodyText text={props.title} isMedium />
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
  },

})