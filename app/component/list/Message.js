
import React from 'react'
import { styles } from '../../core/Style'

import { List } from 'react-native-paper'
import { ScrollView, Text, View } from 'react-native'

const MessageList = props => {
  return (
    <ScrollView style={[styles.flexColumn, styles.flexFull]}>
      { props.rows.map(row => (
        <View key={ row.time } style={[styles.flexRow, styles.mailboxMessage]}>
          <Text style={ styles.flexFull }>{ (new Date(row.time * 1000)).toLocaleDateString("en-US") }</Text>
          <Text style={ styles.flexFull }>{ row.name.split('_')[1] }</Text>
          <Text style={ styles.flexFull }>{ row.unit }</Text>
          <Text style={ styles.flexFull }>{ row.value || row.valueString || row.stringValue || `N/A` }</Text>
        </View>
      )) }
    </ScrollView>
  )
}

MessageList.defaultProps = {
  rows: [],
}

export default MessageList
