
import Component from '../core/Component'
import { connect } from 'react-redux'
import { delUser, getUsers } from '../core/Actions'
import { ICON } from '../core/Constants'
import * as MailComposer from 'expo-mail-composer'
import React from 'react'
import * as SMS from 'expo-sms'
import { styles } from '../core/Style'

import { Button, Dialog, Portal } from 'react-native-paper'
import { ScrollView, Text, View } from 'react-native'
import UserList from '../component/list/User'

class User extends Component {
  componentDidMount() {
    this.props.dispatchGetUsers()
  }

  handleDelete = () => {
    console.log('delete user:', this.state.confirmData)
    this.confirmClose().then(() => this.props.dispatchDelUser(this.state.confirmData.id))
  }

  handleEdit = data => {
    console.log('edit user:', data)
    this.setState({ data }, () => this.props.navigation.navigate('UserModal', { data }))
  }

  handleEmail = async user => {
    if (!!user.email) {
      const result = await MailComposer.composeAsync({
        recipients: [user.email],
        subject: 'SafeBox User Test',
        body: 'This is a test email message from the user screen.',
        isHtml: false,
      })
      console.log('Send email result:', result)
    } else {
      console.log('Unable to send email to user')
    }
  }

  handleSMS = async user => {
    const isAvailable = await SMS.isAvailableAsync()
    if (isAvailable && !!user.phone) {
      const addrs = [user.phone]
      const message = `This is a test SMS message from the user screen.`
      const { result } = await SMS.sendSMSAsync(addrs, message)
      console.log('Send sms result:', result)
    } else {
      console.log('Unable to send SMS to user')
    }
  }

  toggleOpen = () => {
    this.props.navigation.navigate('UserModal')
  }

  render() {
    const user = this.state.confirmData ? this.state.confirmData.name : ''

    return (
      <ScrollView style={ styles.content }>
        <Portal>
          <Dialog onDismiss={ this.confirmClose } visible={ this.state.confirm }>
            <Dialog.Title>Confirm</Dialog.Title>
            <Dialog.Content>
              <Text>This action cannot be reversed, continue deleting "{ user }"?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={ this.handleDelete }>
                Yes
              </Button>
              <Button onPress={ this.confirmClose }>
                No
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View style={ styles.flexRow }>
          <View style={ styles.flexFull } />
          <Button icon={ ICON.ADD } mode="text" onPress={ this.toggleOpen }>
            Add User
          </Button>
        </View>
        <UserList
          onDelete={ this.confirmOpen }
          onEdit={ this.handleEdit }
          onEmail={ this.handleEmail }
          onSMS={ this.handleSMS }
          rows={ this.props.users.filter(o => o.id !== this.props.me.id) } />
      </ScrollView>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchDelUser: v => dispatch(delUser(v)),
  dispatchGetUsers: () => dispatch(getUsers()),
})

const mapState = state => ({
  me: state.me,
  users: state.users,
})

export default connect(mapState, mapDispatch)(User)
