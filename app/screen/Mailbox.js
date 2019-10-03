
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import MailboxList from '../component/list/Mailbox'
import { Subheading } from 'react-native-paper'
import { View } from 'react-native'

class Mailbox extends Component {
  render() {
    const rows = this.props.mailboxes.map(o => ({
      ...o,
      gateway: this.props.gateways.find(v => v.id === o.gatewayId),
    }))

    return (
      <View style={ styles.content }>
        <Subheading>Mailbox</Subheading>
        <MailboxList rows={ rows } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({
  gateways: state.gateways,
  mailboxes: state.mailboxes,
})

export default connect(mapState, mapDispatch)(Mailbox)
