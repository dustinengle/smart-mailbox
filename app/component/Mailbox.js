
import { ICON } from '../core/Constants'
import React from 'react'
import { styles } from '../core/Style'

import Battery from './Battery'
import { Card, TouchableRipple } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View } from 'react-native'

const Mailbox = props => (
  <Card style={ styles.margins }>
    <Card.Title
      left={ props => (
        <Icon
          color="rgba(0, 0, 0, 0.25)"
          { ...props }
          name={ ICON.MAILBOX } />
      ) }
      subtitle={ `SN: ${ props.sn }` }
      title={ props.name } />
    <Card.Content style={[styles.flexRow, styles.spaceAround]}>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Icon
          color={ props.state.package ? 'green' : 'black' }
          name={ props.state.package ? ICON.PACKAGE : ICON.EMPTY }
          size={ 48 } />
        <Text>
          { props.state.package ? 'Package' : 'Empty' }
        </Text>
      </View>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Battery power={ props.state.power } size={ 48 } />
        <Text>
          { props.state.power }%
        </Text>
      </View>
      <View style={[styles.flexFull]}>
        <TouchableRipple onPress={ () => props.state.lock ? props.onUnlock(props) : props.onLock(props) }>
          <View style={[styles.flexColumn, styles.center]}>
            <Icon
              color={ props.state.lock ? 'black' : 'red' }
              name={ props.state.lock ? ICON.LOCKED : ICON.UNLOCKED }
              size={ 48 } />
            <Text>
              { props.state.lock ? 'Locked' : 'Unlocked' }
            </Text>
          </View>
        </TouchableRipple>
      </View>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Icon
          color={ props.state.flag ? 'green' : 'black' }
          name={ props.state.flag ? ICON.UP : ICON.DOWN }
          size={ 48 } />
        <Text>
          { props.state.flag ? 'Up' : 'Down' }
        </Text>
      </View>
    </Card.Content>
  </Card>
)

export default Mailbox
