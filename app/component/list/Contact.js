
import { ICON } from '../../core/Constants'
import React from 'react'
import { styles, theme } from '../../core/Style'

import { Card, Text, TouchableRipple } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScrollView, View } from 'react-native'

const getEmail = (emails = []) => {
  const len = emails.length
  let email = ''
  if (len > 0) {
    let found = false
    emails.forEach(e => {
      if (e.isPrimary) {
        email = e.email
        found = true
      }
    })
    if (!found) email = emails[0].email
  }
  return email
}

const getNumber = (numbers = []) => {
  const len = numbers.length
  let number = ''
  if (len > 0) {
    let found = false
    numbers.forEach(n => {
      if (n.isPrimary) {
        number = `${ n.label ? `${ n.label } - ` : '' }${ n.number }`
        found = true
      }
    })
    if (!found) number = numbers[0].number
  }
  return number
}

const ContactList = props => {
  return (
    <ScrollView>
      { !props.rows.length &&
        <View style={[styles.center]}>
          <Text>There are no contacts to list.</Text>
        </View>
      }
      { props.rows.map(row => (
        <TouchableRipple
          key={ row.id }
          onPress={ () => props.onSelect({
            email: getEmail(row.emails),
            name: row.name,
            id: row.id,
            phone: getNumber(row.phoneNumbers),
          }) }
          style={[styles.margins]}>
          <Card style={[styles.backgroundSurface, styles.flexColumn, styles.padding]}>
            <Card.Title
              title={ row.name }
              titleStyle={[styles.textAccent]} />
            <Card.Content style={ styles.flexColumn }>
              { row.emails &&
                <Text style={{ color: theme.colors.accent }}>
                  <Icon name={ ICON.EMAIL } /> { getEmail(row.emails) }
                </Text>
              }
              { row.phoneNumbers &&
                <Text style={{ color: theme.colors.accent }}>
                  <Icon name={ ICON.PHONE } /> { getNumber(row.phoneNumbers) }
                </Text>
              }
            </Card.Content>
          </Card>
        </TouchableRipple>
      )) }
    </ScrollView>
  )
}

ContactList.defaultProps = {
  rows: [],
}

export default ContactList
