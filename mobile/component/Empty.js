
import React from 'react'
import Styles from '../core/Styles'

import { Text, View } from 'react-native'

export default function Empty(props) {
  return (
    <View style={[Styles.centered]}>
      <Text style={[Styles.empty]}>
        Nothing to see here, try adding a new item.
      </Text>
    </View>
  )
}
