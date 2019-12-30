
import { ICON } from '../core/Constants'
import moment from 'moment'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button, Text } from 'react-native-elements'
import Card, { CardAction } from './Card'
import Empty from './Empty'
import Icon from './Icon'
import Key from './Key'
import { View } from 'react-native'

export const User = props => (
  <Card>
    <View style={[Styles.flexRow]}>
      <View style={[Styles.flexFull, Styles.flexColumn, { justifyContent: 'center' }]}>
        <Text style={{ color: COLOR.ACCENT, fontSize: 18 }}>
          <Key>Name:</Key> { props.name }
        </Text>
        <Text style={{ color: COLOR.BLACK, fontSize: 16 }}>
          <Key>Joined:</Key> { moment(props.createdAt).format('MMM DD, YYYY') }
        </Text>
        <Text style={{ color: COLOR.BLACK, fontSize: 16 }}>
          <Key>Email:</Key> { props.email || 'N/A' }
        </Text>
        <Text style={{ color: COLOR.BLACK, fontSize: 16 }}>
          <Key>Phone:</Key> { props.phone || 'N/A' }
        </Text>
      </View>
      <View style={[Styles.flexColumn]}>
        <Icon color={ COLOR.HALF_BLACK } name={ ICON.USER } size={ 72 } />
      </View>
    </View>
    { !!props.onDelete &&
      <CardAction
        icon={ ICON.DELETE }
        onPress={ () => props.onDelete(props) }
        title="Delete User" />
    }
  </Card>
)

export const UserList = ({ items, ...props }) => {
  if (!items.length) {
    return (<Empty />)
  }

  return items.map(item => (
    <User
      { ...item }
      key={ item.id }
      { ...props } />
  ))
}

UserList.defaultProps = {
  items: [],
}

export default UserList
