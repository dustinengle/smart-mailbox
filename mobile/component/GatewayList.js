
import { ICON } from '../core/Constants'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button, Text } from 'react-native-elements'
import Card, { CardAction } from './Card'
import Empty from './Empty'
import Icon from './Icon'
import Key from './Key'
import { View } from 'react-native'

export const Gateway = props => (
  <Card>
    <View style={[Styles.flexRow]}>
      <View style={[Styles.flexFull, Styles.flexColumn, { justifyContent: 'center' }]}>
        <Text style={{ color: COLOR.ACCENT, fontSize: 18 }}>
          <Key>Name:</Key> { props.name }
        </Text>
      </View>
      <View style={[Styles.flexColumn]}>
        <Icon color={ COLOR.HALF_BLACK } name={ ICON.GATEWAY } size={ 72 } />
      </View>
    </View>
    { !!props.onDelete &&
      <CardAction
        icon={ ICON.DELETE }
        onPress={ () => props.onDelete(props) }
        title="Delete Gateway" />
    }
    { !!props.onMailbox &&
      <CardAction
        onPress={ () => props.onMailbox(props) }
        title="Add Mailbox" />
    }
    { !!props.onMailboxes &&
      <CardAction
        onPress={ () => props.onMailboxes(props) }
        title={ `Manage Mailboxes(${ props.mailboxes.length })` } />
    }
  </Card>
)

export const GatewayList = ({ items, ...props }) => {
  if (!items.length) {
    return (<Empty />)
  }

  return items.map(item => (
    <Gateway
      { ...item }
      key={ item.id }
      { ...props } />
  ))
}

GatewayList.defaultProps = {
  items: [],
}

export default GatewayList
