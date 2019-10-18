
import React from 'react'
import { styles, theme } from '../core/Style'

import { ActivityIndicator } from 'react-native-paper'
import { Text, View } from 'react-native'

const Loader = props => {
  const style = [
    styles.container,
    styles.flexColumn,
    styles.flexFull,
    styles.spaceAround,
  ]
  if (props.background) style.push(styles.backgroundSurface)

  return (
    <View style={ style }>
      <View style={ styles.center }>
        <ActivityIndicator size="large" style={ styles.margins } />
        <Text style={[styles.center, styles.textAccent]}>Loading</Text>
      </View>
    </View>
  )
}

export default Loader
