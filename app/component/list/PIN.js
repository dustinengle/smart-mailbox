
import React from 'react'

import { List } from 'react-native-paper'

const PIN = props => {
  return (
    <List.Section>
      { props.rows.map(row => (
        <List.Accordion
          left={ props => console.log(props) }
          onPress={ props.onEdit }
          title={ row.number }>
          <List.Item>Email: { row.email }</List.Item>
          <List.Item>Number: { row.number }</List.Item>
          <List.Item>Phone: { row.phone }</List.Item>
          <List.Item>Single: { row.single }</List.Item>
          <List.Item>Timeout: { row.timeout }</List.Item>
        </List.Accordion>
      )) }
    </List.Section>
  )
}

PIN.defaultProps = {
  rows: [],
}

export default PIN
