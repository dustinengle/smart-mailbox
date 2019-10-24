
import { ICON } from '../../core/Constants'
import React from 'react'
import { styles, theme } from '../../core/Style'

import {
  Button,
  Card,
  IconButton,
  List,
  TouchableRipple,
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View } from 'react-native'

const MailboxList = props => {
  return (
    <View style={{ paddingBottom: 10 }}>
      { props.rows.map(row => (
        <Card key={ row.id } style={ styles.margins }>
          <Card.Title
            title={ row.name }
            titleStyle={[styles.textAccent]} />
          <Card.Content style={ styles.flexColumn }>
            <View style={ styles.flexRow }>
              <View style={[styles.flexColumn, styles.flexFull]}>
                <Text>SN#: { row.sn }</Text>
                <Text>GW#: { row.gateway }</Text>
                <Text>PWR: { row.power }%</Text>
              </View>
              <View style={[styles.flexColumn, styles.flexFull]}>
                <Text>Flag: { row.flag ? 'Up' : 'Down' }</Text>
                <Text>Lock: { row.lock ? 'Locked' : 'Unlocked' }</Text>
                <Text>Body: { row.package ? 'Package' : 'Empty' }%</Text>
              </View>
            </View>
            <View style={[styles.flexRow]}>
              <Button
                mode="outlined"
                onPress={ () => props.onDelete(row) }
                style={[styles.cardButton, styles.cardButtonNoRight, styles.flexFull]}>
                Delete
              </Button>
              <Button
                mode="outlined"
                onPress={ () => props.onRename(row) }
                style={[styles.cardButton, styles.cardButtonNoLeft, styles.flexFull]}>
                Rename
              </Button>
            </View>
            <Button
              mode="outlined"
              onPress={ () => props.onMessages(row) }
              style={ styles.cardButton }>
              View Messages
            </Button>
            <Button
              mode="outlined"
              onPress={ () => props.onCreatePIN(row) }
              style={ styles.cardButton }>
              Create PIN
            </Button>
            { !!row.pins.length &&
              <List.Section>
                <List.Accordion title="PINs">
                  { row.pins.map(pin => (
                    <List.Item
                      key={ pin.id }
                      right={ subProps => (
                        <TouchableRipple onPress={ () => props.onDeletePIN(pin) }>
                          <Icon { ...subProps } name={ ICON.DELETE } size={ 16 } />
                        </TouchableRipple>
                      ) }
                      title={ `${ pin.name ? `${ pin.name } - ` : '' }${ pin.number }` } />
                  )) }
                </List.Accordion>
              </List.Section>
            }
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
