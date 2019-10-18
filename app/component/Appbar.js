
import config from '../package.json'
import React from 'react'
import { styles, theme } from '../core/Style'

import { Appbar } from 'react-native-paper'
import { Image, View } from 'react-native'

const Bar = props => (
  <Appbar dark={ !theme.dark } style={ styles.appBar }>
    <Image
      source={ require('../assets/mailbox_white.png') }
      style={{ height: 36, marginLeft: 10, width: 48 }} />
    <View style={ styles.flexFull } />
    <Appbar.Content
      subtitle={ !!config.version ? `v${ config.version }` : null }
      subtitleStyle={{
        color: theme.colors.whiteOpacity,
        textAlign: 'right',
      }}
      title="It's Here"
      titleStyle={{
        color: theme.colors.surface,
        fontFamily: 'modelica-bold',
        textAlign: 'right',
      }} />
  </Appbar>
)

export default Bar
