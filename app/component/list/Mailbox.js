
import { ICON } from '../../core/Constants'
import React, { useState } from 'react'
import { styles } from '../../core/Style'

import { Button, Card, IconButton, List } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View } from 'react-native'

const MailboxList = props => {
  return (
    <View>
      { props.rows.map(row => (
        <Card key={ row.id } style={ styles.margins }>
          <Card.Title title={ row.name } />
          <Card.Content style={ styles.flexColumn }>
            <View style={ styles.flexRow }>
              <View style={[styles.flexColumn, styles.flexFull]}>
                <Text>Name: { row.name }</Text>
                <Text>SN: { row.sn }</Text>
                <Text>Gateway: { row.gateway ? row.gateway.sn : row.gatewayId }</Text>
                <Text>PINs: { row.pins.length || 0 }</Text>
              </View>
              <View style={[styles.flexColumn, styles.flexFull]}>
                <Text>Flag: { row.state.flag ? 'Up' : 'Down' }</Text>
                <Text>Lock: { row.state.lock ? 'Locked' : 'Unlocked' }</Text>
                <Text>Package: { row.state.package ? 'Package' : 'Empty' }</Text>
                <Text>Power: { row.state.power }%</Text>
              </View>
            </View>
            <List.Section>
              <List.Accordion title="PINs">
                { row.pins.map(pin => (
                  <List.Item
                    key={ pin.id }
                    right={ subProps => (
                      <IconButton
                        { ...subProps }
                        icon={ ICON.DELETE }
                        onPress={ () => props.onDeletePIN(pin) } />
                    ) }
                    title={ `${ pin.name } - ${ pin.number }` } />
                )) }
              </List.Accordion>
            </List.Section>
            <Button
              mode="outlined"
              onPress={ () => props.onCreatePIN(row) }
              style={ styles.button }>
              Add PIN
            </Button>
            <Button
              mode="outlined"
              onPress={ () => props.onRename(row) }
              style={ styles.button }>
              Rename
            </Button>
          </Card.Content>
        </Card>
      )) }
    </View>
  )
}

MailboxList.defaultProps = {
  rows: [],
}

export default MailboxList
