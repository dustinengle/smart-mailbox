
import React from 'react'

import { Text as T } from 'react-native'

const Text = props => (
  <T { ...props } style={{ ...props.style, fontFamily: 'modelica' }} />
)

export default Text
