
import React from 'react'

import { List } from 'react-native-paper'

const Mailbox = props => {
  return (
    <List.Section>
      { props.rows.map(row => (
        <List.Accordion
          left={ props => console.log(props) }
          onPress={ props.onEdit }
          title={ row.name }>
          <List.Item>Email: { row.email }</List.Item>
          <List.Item>Google: { row.google ? 'Yes' : 'No' }</List.Item>
          <List.Item>Name: { row.name }</List.Item>
          <List.Item>Phone: { row.phone }</List.Item>
        </List.Accordion>
      )) }
    </List.Section>
  )
}

Mailbox.defaultProps = {
  rows: [],
}

export default Mailbox
