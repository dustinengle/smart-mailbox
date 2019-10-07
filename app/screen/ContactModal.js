
import Component from '../core/Component'
import { connect } from 'react-redux'
import { Fields, getContactsAsync } from 'expo-contacts'
import * as Permissions from 'expo-permissions'
import React from 'react'
import { styles } from '../core/Style'

import ContactList from '../component/list/Contact'
import { Text, View } from 'react-native'

class ContactModal extends Component {
  static navigationOptions = {
    title: 'Select Contact',
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      contacts: [],
      hasPermission: false,
    }
  }

  async componentDidMount() {
    this.getPermissionsAsync()
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS)
    this.setState({ hasPermission: status === 'granted' }, async () => {
      this.handleContacts()
    })
  }

  handleContacts = async () => {
    const { data } = await getContactsAsync({
      fields: [Fields.Emails, Fields.Name, Fields.PhoneNumbers],
    })
    this.setState({ contacts: data })
  }

  handleSelect = contact => {
    const callback = this.props.navigation.getParam('callback', null)
    if (!!callback) {
      callback(contact)
      this.props.navigation.goBack()
    }
  }

  render() {
    return (
      <View style={ styles.content }>
        <ContactList onSelect={ this.handleSelect } rows={ this.state.contacts } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({

})

export default connect(mapState, mapDispatch)(ContactModal)
