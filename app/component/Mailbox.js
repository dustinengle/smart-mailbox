
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
        <Icon color="rgba(0, 0, 0, 0.25)" { ...props } name={ ICON.MAILBOX } />
      ) }
      subtitle={ `#${ props.sn }` }
      title={ props.name } />
    <Card.Content style={[styles.flexRow, styles.spaceAround]}>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Icon
          color={ props.package ? 'green' : 'black' }
          name={ props.package ? ICON.PACKAGE : ICON.EMPTY }
          size={ 48 } />
        <Text>
          { props.package ? 'Package' : 'Empty' }
        </Text>
      </View>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Battery power={ props.power } size={ 48 } />
        <Text>
          { props.power }%
        </Text>
      </View>
      <View style={[styles.flexFull]}>
        <TouchableRipple onPress={ () => props.lock ? props.onUnlock(props) : props.onLock(props) }>
          <View style={[styles.flexColumn, styles.center]}>
            <Icon
              color={ props.lock ? 'black' : 'red' }
              name={ props.lock ? ICON.LOCKED : ICON.UNLOCKED }
              size={ 48 } />
            <Text>
              { props.lock ? 'Locked' : 'Unlocked' }
            </Text>
          </View>
        </TouchableRipple>
      </View>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Icon
          color={ props.flag ? 'green' : 'black' }
          name={ props.flag ? ICON.UP : ICON.DOWN }
          size={ 48 } />
        <Text>
          { props.flag ? 'Up' : 'Down' }
        </Text>
      </View>
    </Card.Content>
  </Card>
)

export default Mailbox
