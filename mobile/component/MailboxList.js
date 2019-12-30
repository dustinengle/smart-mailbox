
import { ICON } from '../core/Constants'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button, Text } from 'react-native-elements'
import Card, { CardAction } from './Card'
import Empty from './Empty'
import Icon from './Icon'
import Key from './Key'
import { View } from 'react-native'

export const Mailbox = props => (
  <Card>
    <View style={[Styles.flexRow]}>
      <View style={[Styles.flexFull, Styles.flexColumn, { justifyContent: 'center' }]}>
        <Text style={{ color: COLOR.ACCENT, fontSize: 18 }}>
          <Key>Name:</Key> { props.name }
        </Text>
        <Text style={{ color: COLOR.ACCENT, fontSize: 18 }}>
          <Key>Gateway:</Key> { props.gateway.name }
        </Text>
      </View>
      <View style={[Styles.flexColumn]}>
        { !props.onLock &&
          <Icon color={ COLOR.HALF_BLACK } name={ ICON.MAILBOX } size={ 72 } />
        }
        { !!props.onLock &&
          <Button
            icon={ (
              <Icon
                color={ props.lock ? COLOR.HALF_BLACK : COLOR.RED }
                name={ props.lock ? ICON.LOCKED : ICON.UNLOCKED }
                size={ 72 } />
            ) }
            onPress={ () => props.onLock(props) }
            type="clear" />
        }
      </View>
    </View>
    { !!props.onPIN &&
      <CardAction
        onPress={ () => props.onPIN(props) }
        title="Add PIN" />
    }
    { !!props.onPINs &&
      <CardAction
        onPress={ () => props.onPINs(props) }
        title={ `Manage PINs(${ Array.isArray(props.pins) ? props.pins.length : 0 })`} />
    }
  </Card>
)

export const MailboxList = ({ items, ...props }) => {
  if (!items.length) {
    return (<Empty />)
  }

  return items.map(item => (
    <Mailbox
      { ...item }
      key={ item.id }
      { ...props } />
  ))
}

MailboxList.defaultProps = {
  items: [],
  onLock: false,
  onPIN: false,
}

export default MailboxList
