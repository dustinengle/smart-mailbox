
import { ICON } from '../../core/Constants'
import React from 'react'
import { styles } from '../../core/Style'

import { Button, Card, TouchableRipple } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Text, View } from 'react-native'

const UserList = props => {
  return (
    <View>
      { props.rows.map(row => (
        <Card key={ row.id } style={ styles.margins }>
          <Card.Title
            left={ subProps => (
              <Icon color="rgba(0, 0, 0, 0.25)" { ...subProps } name={ ICON.USER } />
            ) }
            right={ subProps => (
              <View style={[styles.flexRow, styles.margin]}>
              <TouchableRipple onPress={ () => props.onEdit(row) } style={ styles.margins }>
                <Text>MANAGE</Text>
              </TouchableRipple>
              <TouchableRipple onPress={ () => props.onDelete(row) } style={ styles.margins }>
                <Text>DELETE</Text>
              </TouchableRipple>
              </View>
            ) }
            title={ row.name } />
          <Card.Content style={ styles.flexColumn }>
            <View style={[styles.center, styles.flexRow, styles.spaceAround]}>
              { !!row.email &&
                <TouchableRipple onPress={ () => props.onEmail(row) }>
                  <View style={[styles.flexRow]}>
                    <Icon name={ ICON.EMAIL } size={ 18 } style={{ marginRight: 10 }} />
                    <Text>{ row.email }</Text>
                  </View>
                </TouchableRipple>
              }
              { !!row.phone &&
                <TouchableRipple onPress={ () => props.onSMS(row) }>
                  <View style={[styles.flexRow]}>
                    <Icon name={ ICON.PHONE } size={ 18 } style={{ marginRight: 10 }} />
                    <Text>{ row.phone }</Text>
                  </View>
                </TouchableRipple>
              }
            </View>
          </Card.Content>
        </Card>
      )) }
    </View>
  )
}

UserList.defaultProps = {
  rows: [],
}

export default UserList
