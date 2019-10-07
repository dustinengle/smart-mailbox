
import { ICON } from '../../core/Constants'
import React, { useEffect, useState } from 'react'
import { styles } from '../../core/Style'

import { ActivityIndicator, Text, TouchableRipple } from 'react-native-paper'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!!props.rows.length) setLoading(false)
  })

  return (
    <ScrollView style={[styles.flexColumn, styles.flexFull]}>
      { !!loading &&
        <View style={[styles.center, styles.flexColumn, styles.flexFull, styles.spaceAround]}>
          <ActivityIndicator />
          <Text>Loading contacts, this could take a moment.</Text>
        </View>
      }
      { !props.rows.length && !loading &&
        <View style={[styles.center]}>
          <Text>There are no contacts to list.</Text>
        </View>
      }
      { !loading && props.rows.map(row => (
        <TouchableRipple
          key={ row.id }
          onPress={ () => props.onSelect({
            email: getEmail(row.emails),
            name: row.name,
            id: row.id,
            phone: getNumber(row.phoneNumbers),
          }) }
          style={[styles.flexRow, styles.margins]}>
          <View style={ styles.flexColumn }>
            <Text>{ row.name }</Text>
            { row.emails &&
              <Text>
                <Icon name={ ICON.EMAIL } /> { getEmail(row.emails) }
              </Text>
            }
            { row.phoneNumbers &&
              <Text>
                <Icon name={ ICON.PHONE } /> { getNumber(row.phoneNumbers) }
              </Text>
            }
          </View>
        </TouchableRipple>
      )) }
    </ScrollView>
  )
}

ContactList.defaultProps = {
  rows: [],
}

export default ContactList
