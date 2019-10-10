
import Component from '../core/Component'
import { connect } from 'react-redux'
import { delMailboxPIN, postMailboxPIN, postMailbox } from '../core/Actions'
import React from 'react'
import { styles } from '../core/Style'

import { Button, Dialog, Portal } from 'react-native-paper'
import MailboxList from '../component/list/Mailbox'
import { ScrollView, Text } from 'react-native'

class Mailbox extends Component {
  handleCreatePIN = pin => {
    console.log('create pin:', pin)
    this.props.dispatchCreatePIN(pin)
  }

  handleDeletePIN = () => {
    console.log('delete pin:', this.state.confirmData)
    this.props.dispatchDeletePIN(this.state.confirmData)
      .then(() => this.confirmClose())
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
    const pin = this.state.confirmData ? this.state.confirmData.number : ''
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
              <Text>This action cannot be reversed, continue deleting "{ pin }"?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={ this.handleDeletePIN }>
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
          onDeletePIN={ this.confirmOpen }
          onLock={ data => console.log('lock:', data) }
          onRename={ data => this.setState({ data }, this.toggleOpenRename) }
          onUnlock={ data => console.log('unlock:', data) } />
      </ScrollView>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchCreatePIN: v => dispatch(postMailboxPIN(v)),
  dispatchDeletePIN: v => dispatch(delMailboxPIN(v)),
  dispatchRename: v => dispatch(postMailbox(v)),
})

const mapState = state => ({
  mailboxes: state.mailboxes,
  pins: state.pins,
})

export default connect(mapState, mapDispatch)(Mailbox)
