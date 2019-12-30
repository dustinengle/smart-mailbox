
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Text } from 'react-native-elements'

const Key = props => (
  <Text style={{ color: COLOR.PRIMARY }}>
    { props.children }
  </Text>
)

export default Key
