
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { getMailboxMessages } from '../core/Actions'
import { styles } from '../core/Style'

import MessageList from '../component/list/Message'
import { View } from 'react-native'

class MessageModal extends Component {
  static getDerivedStateFromProps(props, state) {
    const data = props.navigation.getParam('data', null)
    if (data && data.id && !state.id) {
      state.id = data.id
      return state
    }
    return null
  }

  static navigationOptions = {
    title: 'Mailbox Messages',
  }

  componentDidMount() {
    if (this.state.id) this.props.dispatchGetMailboxMessages({ id: this.state.id })
  }

  render() {
    const rows = this.props.messages
      .filter(v => v.publisher !== this.state.id)
      .map(v => ({
        ...v,
      }))

    return (
      <View key={ this.state.id || 0 } style={ styles.content }>
        <MessageList rows={ rows } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchGetMailboxMessages: v => dispatch(getMailboxMessages(v)),
})

const mapState = state => ({
  messages: state.messages,
})

export default connect(mapState, mapDispatch)(MessageModal)
