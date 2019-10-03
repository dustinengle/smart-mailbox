
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import { Subheading } from 'react-native-paper'
import { Text, View } from 'react-native'

class Dashboard extends Component {
  render() {
    const size = this.props.mailboxes.length

    return (
      <View style={ styles.content }>
        <Subheading>Dashboard</Subheading>
        { !!size && this.props.mailboxes.map(mailbox => {
          <Text>{ mailbox.name }</Text>
        }) }
        { !size &&
          <Text>There are no mailboxes, please create one.</Text>
        }
      </View>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({
  mailboxes: state.mailboxes,
})

export default connect(mapState, mapDispatch)(Dashboard)
