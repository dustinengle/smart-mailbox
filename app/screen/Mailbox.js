
import Component from '../core/Component'
import { connect } from 'react-redux'
import {
  delMailbox,
  delMailboxPIN,
  postMailboxPIN,
  postMailbox,
  postMailboxMessage,
} from '../core/Actions'
import React from 'react'
import SenML from '../core/SenML'
import { styles } from '../core/Style'

import { Button, Dialog, Portal } from 'react-native-paper'
import MailboxList from '../component/list/Mailbox'
import { ScrollView, Text } from 'react-native'

class Mailbox extends Component {
  handleCreatePIN = pin => {
    console.log('create pin:', pin)
    this.props.dispatchCreatePIN(pin)
  }

  handleDelete = () => {
    console.log('delete mailbox:', this.state.confirmData)
    this.props.dispatchDeleteMailbox(this.state.confirmData)
      .then(() => this.confirmClose())
  }

  handleDeletePIN = () => {
    console.log('delete pin:', this.state.confirmData)
    this.props.dispatchDeletePIN(this.state.confirmData)
      .then(() => this.confirmClose())
  }

  handleMessages = mailbox => {
    console.log('mailbox messages:', mailbox)
    this.props.navigation.navigate('MessageModal', { data: mailbox })
  }

  handleMessageLock = data => {
    console.log('lock:', data)
    this.props.dispatchPostMailboxMessage({
      accountId: this.props.me.accountId,
      mailboxId: data.id,
      senML: SenML.lock(data.deviceId),
    })
  }

  handleMessageUnlock = data => {
    console.log('unlock:', data)
    this.props.dispatchPostMailboxMessage({
      accountId: this.props.me.accountId,
      mailboxId: data.id,
      senML: SenML.unlock(data.deviceId),
    })
  }

  handleRename = mailbox => {
    console.log('rename mailbox:', mailbox)
    this.props.dispatchRename(mailbox)
  }

  toggleOpenPIN = () => {
    this.props.navigation.navigate('PINModal', {
      callback: this.handleCreatePIN,
      data: { mailboxId: this.state.data.id },
    })
  }

  toggleOpenRename = () => {
    this.props.navigation.navigate('RenameModal', {
      callback: this.handleCreatePIN,
      data: this.state.data,
    })
  }

  render() {
    const { name, number } = this.state.confirmData || {}
    const rows = this.props.mailboxes.map(row => ({
      ...row,
      pins: this.props.pins.filter(pin => pin.mailboxId === row.id),
    }))

    return (
      <ScrollView style={ styles.content }>
        <Portal>
          <Dialog onDismiss={ this.confirmClose } visible={ this.state.confirm }>
            <Dialog.Title>Confirm</Dialog.Title>
            <Dialog.Content>
              <Text>This action cannot be reversed, continue deleting "{ isNaN(number) ? name : number }"?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={ isNaN(number) ? this.handleDelete : this.handleDeletePIN }>
                Yes
              </Button>
              <Button onPress={ this.confirmClose }>
                No
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <MailboxList
          rows={ rows }
          onCreatePIN={ data => this.setState({ data }, this.toggleOpenPIN) }
          onDelete={ this.confirmOpen }
          onDeletePIN={ this.confirmOpen }
          onLock={ this.handleMessageLock }
          onMessages={ this.handleMessages }
          onRename={ data => this.setState({ data }, this.toggleOpenRename) }
          onUnlock={ this.handleMessageUnlock } />
      </ScrollView>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchCreatePIN: v => dispatch(postMailboxPIN(v)),
  dispatchDeleteMailbox: v => dispatch(delMailbox(v)),
  dispatchDeletePIN: v => dispatch(delMailboxPIN(v)),
  dispatchPostMailboxMessage: v => dispatch(postMailboxMessage(v)),
  dispatchRename: v => dispatch(postMailbox(v)),
})

const mapState = state => ({
  mailboxes: state.mailboxes,
  me: state.me,
  pins: state.pins,
})

export default connect(mapState, mapDispatch)(Mailbox)
