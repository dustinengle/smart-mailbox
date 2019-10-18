
import { ACTION, ICON } from '../core/Constants'
import Component from '../core/Component'
import { connect } from 'react-redux'
import {
  dismiss,
  getMailboxes,
  getMailboxMessages,
  postMailboxMessage,
} from '../core/Actions'
import React from 'react'
import SenML from '../core/SenML'
import { styles } from '../core/Style'

import Alert from '../component/Alert'
import { Button, Portal } from 'react-native-paper'
import Mailbox from '../component/Mailbox'
import { RefreshControl, ScrollView, View } from 'react-native'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.messageTimer = null
  }

  componentDidMount() {
    if (!this.props.me.accountId) {
      this.props.navigation.navigate('Login')
      return
    }

    const deviceMap = new Map()
    this.props.dispatchGetMailboxes()
      .then(({ result: { mailboxes } }) => {
        const promises = [];
        mailboxes.forEach(v => {
          deviceMap.set(v.deviceId, v)
          promises.push(this.props.dispatchGetMailboxMessages(v))
        })
        return Promise.all(promises)
      })
      .then(res => {
        res
          .map(r => r.result.messages.reverse())
          .forEach(r => r.forEach(v => {
            if (deviceMap.has(v.publisher)) {
              const mailbox = deviceMap.get(v.publisher)

              switch(v.unit) {
                case 'FLAG':
                case 'Flag':
                  mailbox.flag = !!v.value
                  break
                case 'LOCK':
                case 'Lock':
                  mailbox.lock = !!v.value
                  break
                case 'PACKAGE':
                case 'Package':
                  mailbox.package = !!v.value
                  break
                case 'POWER':
                case 'Power':
                  mailbox.power = v.value
                  break
                default:
                  break
              }

              deviceMap.set(v.publisher, mailbox)
            }
          }))

        deviceMap.forEach(v => {
          this.props.dispatchPutMailbox(v)
        })

        this.setState({ refreshing: false })
      })
      .catch(err => this.setState({ refreshing: false }))
  }

  componentWillUnmount() {
    clearTimeout(this.messageTimer)
  }

  handleDismiss = data => {
    console.log('dismiss alert:', data)
    this.props.dispatchDismiss(data)
  }

  handleMessageLock = data => {
    console.log('lock:', data)
    this.props.dispatchPostMailboxMessage({
      accountId: this.props.me.accountId,
      mailboxId: data.id,
      senML: SenML.lock(data.deviceId),
    }).then(() => {
      this.props.dispatchPutMailbox({ ...data, lock: true })
    })
  }

  handleMessageUnlock = data => {
    console.log('unlock:', data)
    this.props.dispatchPostMailboxMessage({
      accountId: this.props.me.accountId,
      mailboxId: data.id,
      senML: SenML.unlock(data.deviceId),
    }).then(() => {
      this.props.dispatchPutMailbox({ ...data, lock: false })
    })
  }

  loadMessages = mailbox => {
    clearTimeout(this.messageTimer)
    this.messagesTimer = this.props.dispatchGetMailboxMessages(mailbox)
      .then(messages => {
        console.log('messages:', mailbox, messages)
        this.loadMessages()
      })
  }

  toggleOpen = () => {
    this.props.navigation.navigate('AttachModal')
  }

  render() {
    const rows = this.props.mailboxes
      .sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
      .map(o => ({
        ...o,
      }))

    return (
      <ScrollView
        refreshControl={ (
          <RefreshControl
            refreshing={ this.state.refreshing }
            onRefresh={ () => this.setState({ refreshing: true }, this.componentDidMount) } />
        ) }
        style={[styles.flexColumn, styles.margins]}>
        <Portal>
          { this.props.alerts.map(alert => (
            <Alert { ...alert } key={ alert.id } onDismiss={ this.handleDismiss } />
          )) }
        </Portal>
        <View style={ styles.flexRow }>
          <View style={ styles.flexFull } />
          <Button icon={ ICON.ADD } mode="text" onPress={ this.toggleOpen }>
            Add Mailbox
          </Button>
        </View>
        { rows.map(row => (
          <Mailbox
            { ...row }
            key={ row.id }
            onLock={ this.handleMessageLock }
            onUnlock={ this.handleMessageUnlock } />
        )) }
      </ScrollView>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchDismiss: v => dispatch(dismiss(v)),
  dispatchGetMailboxes: () => dispatch(getMailboxes()),
  dispatchGetMailboxMessages: v => dispatch(getMailboxMessages(v)),
  dispatchPostMailboxMessage: v => dispatch(postMailboxMessage(v)),
  dispatchPutMailbox: v => dispatch({ payload: v, type: ACTION.MAILBOX }),
})

const mapState = state => ({
  alerts: state.alerts,
  mailboxes: state.mailboxes,
  me: state.me,
})

export default connect(mapState, mapDispatch)(Dashboard)
