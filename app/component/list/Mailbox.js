
import { ICON } from '../../core/Constants'
import React, { useState } from 'react'
import { styles } from '../../core/Style'

import Battery from '../Battery'
import { Button, Card, IconButton, List, TouchableRipple } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View } from 'react-native'

const MailboxList = props => {
  return (
    <View>
      { props.rows.map(row => (
        <Card key={ row.id } style={ styles.margins }>
          <Card.Title
            left={ subProps => (
              <Icon color="rgba(0, 0, 0, 0.25)" { ...subProps } name={ ICON.MAILBOX } />
            ) }
            right={ subProps => (
              <View style={[styles.flexRow, styles.margin]}>
              <TouchableRipple onPress={ () => props.onCreatePIN(row) } style={ styles.margins }>
                <Text>ADD PIN</Text>
              </TouchableRipple>
              <TouchableRipple onPress={ () => props.onRename(row) } style={ styles.margins }>
                <Text>RENAME</Text>
              </TouchableRipple>
              </View>
            ) }
            subtitle={ `#${ row.sn }` }
            title={ row.name } />
          <Card.Content style={ styles.flexColumn }>
            <View style={ styles.flexRow }>
              <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
                <Icon
                  color={ row.state.package ? 'green' : 'black' }
                  name={ row.state.package ? ICON.PACKAGE : ICON.EMPTY }
                  size={ 24 } />
                <Text>
                  { row.state.package ? 'Package' : 'Empty' }
                </Text>
              </View>
              <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
                <Battery power={ row.state.power } size={ 24 } />
                <Text>
                  { row.state.power }%
                </Text>
              </View>
              <View style={[styles.flexFull]}>
                <TouchableRipple onPress={ () => row.state.lock ? props.onUnlock(row) : props.onLock(row) }>
                  <View style={[styles.flexColumn, styles.center]}>
                    <Icon
                      color={ row.state.lock ? 'black' : 'red' }
                      name={ row.state.lock ? ICON.LOCKED : ICON.UNLOCKED }
                      size={ 24 } />
                    <Text>
                      { row.state.lock ? 'Locked' : 'Unlocked' }
                    </Text>
                  </View>
                </TouchableRipple>
              </View>
              <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
                <Icon
                  color={ row.state.flag ? 'green' : 'black' }
                  name={ row.state.flag ? ICON.UP : ICON.DOWN }
                  size={ 24 } />
                <Text>
                  { row.state.flag ? 'Up' : 'Down' }
                </Text>
              </View>
              <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
                <Icon
                  color={ 'black' }
                  name={ ICON.GATEWAY }
                  size={ 24 } />
                <Text>
                  #{ row.gateway }
                </Text>
              </View>
            </View>
            <List.Section>
              <List.Accordion title={ `${ row.pins.length } PIN(s)` }>
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
