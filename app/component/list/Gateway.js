
import React from 'react'

import { List } from 'react-native-paper'

const Gateway = props => {
  return (
    <List.Section>
      { props.rows.map(row => (
        <List.Accordion
          left={ props => console.log(props) }
          onPress={ props.onEdit }
          title={ row.mailbox.name }>
          <List.Item>Channel ID: { row.channelId }</List.Item>
          <List.Item>Device ID: { row.deviceId }</List.Item>
          <List.Item>Device Key: { row.deviceKey }</List.Item>
          <List.Item>Mailbox: { row.mailbox }</List.Item>
          <List.Item>Public Key: { row.publicKey }</List.Item>
          <List.Item>SN: { row.sn }</List.Item>
          <List.Item>Status: { row.status }</List.Item>
        </List.Accordion>
      )) }
    </List.Section>
  )
}

Gateway.defaultProps = {
  rows: [],
}

export default Gateway
