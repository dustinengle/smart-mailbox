
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { getMailboxMessages } from '../core/Actions'
import { styles, theme } from '../core/Style'

import Loader from '../component/Loader'
import MessageList from '../component/list/Message'
import { View } from 'react-native'

class MessageModal extends Component {
  static getDerivedStateFromProps(props, state) {
    const data = props.navigation.getParam('data', null)
    if (data && data.id && !state.id) {
      return { ...state, ...data }
    }
    return null
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: theme.colors.accent,
    },
    headerTintColor: theme.colors.white,
    title: 'Mailbox Messages',
  }

  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount() {
    if (this.state.id) {
      this.props.dispatchGetMailboxMessages({ id: this.state.id })
        .then(() => this.setState({ loading: false }))
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Loader />
      )
    }

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
