
import { ICON } from '../core/Constants'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button } from 'react-native-elements'
import Icon from './Icon'
import { View } from 'react-native'

export const CardAction = ({ buttonStyle, icon, titleStyle, ...props }) => (
  <Button
    type="outline"
    { ...props }
    buttonStyle={{ marginTop: 10, ...buttonStyle }}
    onPress={ props.onPress }
    titleStyle={{ color: COLOR.PRIMARY, fontSize: 18, ...titleStyle }} />
)

CardAction.defaultProps = {
  buttonStyle: {},
  titleStyle: {},
}

export const Card = ({ children, style, ...props }) => {
  return (
    <View style={[Styles.card, style]} { ...props }>
      { children }
    </View>
  )
}

Card.defaultProps = {
}

export default Card
