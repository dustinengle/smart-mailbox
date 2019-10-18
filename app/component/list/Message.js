
import moment from 'moment'
import React from 'react'
import { styles, theme } from '../../core/Style'

import { Card } from 'react-native-paper'
import { ScrollView, Text, View } from 'react-native'

const MessageList = props => {
  return (
    <ScrollView style={[styles.flexColumn, styles.flexFull]}>
      { props.rows.map(row => (
        <Card key={ `${ row.time }-${ row.name }` } style={ styles.margins }>
          <Card.Title
            title={ moment(row.time * 1000).format('YYYY-MM-DD HH:mm:ss') }
            titleStyle={ styles.textAccent } />
          <Card.Content style={[styles.flexColumn]}>
            <Text style={[styles.flexFull, styles.textWhite]}>
              <Text style={ styles.textPrimary }>Name:</Text> { row.name.split('_')[1] }
            </Text>
            <Text style={[styles.flexFull, styles.textWhite]}>
              <Text style={ styles.textPrimary }>Unit:</Text> { row.unit }
            </Text>
            <Text style={[styles.flexFull, styles.textWhite]}>
              <Text style={ styles.textPrimary }>Value:</Text> { row.value || row.valueString || row.stringValue || `N/A` }
            </Text>
          </Card.Content>
        </Card>
      )) }
    </ScrollView>
  )
}

MessageList.defaultProps = {
  rows: [],
}

export default MessageList
