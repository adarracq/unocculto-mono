import Fontisto from '@expo/vector-icons/Fontisto';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import BodyText from '../atoms/BodyText';

type RadioButtonProps = {
  title: string;
  onPress: () => void;
  selected: boolean;
}

export default function SimpleRadioButton(props: RadioButtonProps) {
  return (
    <TouchableOpacity onPress={props.onPress}
      style={styles.container}>
      <BodyText text={props.title} isMedium />
      {
        props.selected ?
          <Fontisto name="radio-btn-active" size={20} color={Colors.main} />
          :
          <Fontisto name="radio-btn-passive" size={20} color={Colors.lightGrey} />

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