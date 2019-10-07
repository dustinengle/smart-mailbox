
import { ICON } from '../core/Constants'
import React from 'react'
import { styles } from '../core/Style'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

const Alert = props => (
  <View style={[styles.alert, styles.flexColumn, styles.margins, styles.paddings]}>
    <View style={ styles.flexRow }>
      <Text style={ styles.textWhite }>{ props.title }</Text>
      <View style={ styles.flexFull } />
      <TouchableRipple onPress={ () => props.onDismiss(props) }>
        <Icon name={ ICON.CLOSE } size={ 18 } style={ styles.textWhite } />
      </TouchableRipple>
    </View>
    <Text style={[styles.paddings, styles.textWhite]}>{ props.message }</Text>
  </View>
)

export default Alert
