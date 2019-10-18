
import { ICON } from '../core/Constants'
import React from 'react'
import { styles, theme } from '../core/Style'

import Battery from './Battery'
import { Card, TouchableRipple } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View } from 'react-native'

const Mailbox = props => (
  <Card style={ styles.margins }>
    <Card.Title
      subtitle={ `#${ props.sn }` }
      subtitleStyle={{ color: theme.colors.primary }}
      title={ props.name }
      titleStyle={[styles.textAccent]} />
    <Card.Content style={[styles.flexRow, styles.spaceAround]}>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Icon
          color={ props.package ? theme.colors.primary : theme.colors.white }
          name={ props.package ? ICON.PACKAGE : ICON.EMPTY }
          size={ 48 } />
        <Text style={ props.package ? styles.textPrimary : styles.textWhite }>
          { props.package ? 'Package' : 'Empty' }
        </Text>
      </View>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Battery power={ props.power } size={ 48 } />
        <Text style={ props.power < 20 ? styles.textPrimary : styles.textWhite }>
          { props.power }%
        </Text>
      </View>
      <View style={[styles.flexFull]}>
        <TouchableRipple onPress={ () => props.lock ? props.onUnlock(props) : props.onLock(props) }>
          <View style={[styles.flexColumn, styles.center]}>
            <Icon
              color={ props.lock ? theme.colors.white : theme.colors.primary }
              name={ props.lock ? ICON.LOCKED : ICON.UNLOCKED }
              size={ 48 } />
            <Text style={ !props.lock ? styles.textPrimary : styles.textWhite }>
              { props.lock ? 'Locked' : 'Unlocked' }
            </Text>
          </View>
        </TouchableRipple>
      </View>
      <View style={[styles.flexColumn, styles.flexFull, styles.center]}>
        <Icon
          color={ props.flag ? theme.colors.primary : theme.colors.white }
          name={ props.flag ? ICON.UP : ICON.DOWN }
          size={ 48 } />
        <Text style={ props.flag ? styles.textPrimary : styles.textWhite }>
          { props.flag ? 'Up' : 'Down' }
        </Text>
      </View>
    </Card.Content>
  </Card>
)

export default Mailbox
