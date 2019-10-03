
import React from 'react'

import { List } from 'react-native-paper'

const Mailbox = props => {
  return (
    <List.Section>
      { props.rows.map(row => (
        <List.Accordion
          left={ props => console.log(props) }
          onPress={ props.onEdit }
          title={ row.name || 'Name not set' }>
          <List.Item>Gateway: { row.gateway }</List.Item>
          <List.Item>Name: { row.name }</List.Item>
          <List.Item>SN: { row.sn }</List.Item>
          <List.Item>Status: { row.status }</List.Item>
        </List.Accordion>
      )) }
    </List.Section>
  )
}

Mailbox.defaultProps = {
  rows: [],
}

export default Mailbox
