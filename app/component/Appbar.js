
import React from 'react'
import { styles, theme } from '../core/Style'

import { Appbar } from 'react-native-paper'

const Bar = props => (
  <Appbar dark={ !theme.dark } style={ styles.appBar }>
    <Appbar.Content subtitle="v1.0.0" title="SafeBox" />
  </Appbar>
)

export default Bar
