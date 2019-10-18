
import Component from '../core/Component'
import { connect } from 'react-redux'
import { Fields, getContactsAsync } from 'expo-contacts'
import * as Permissions from 'expo-permissions'
import React from 'react'
import { styles, theme } from '../core/Style'

import ContactList from '../component/list/Contact'
import Loader from '../component/Loader'
import { View } from 'react-native'

class ContactModal extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: theme.colors.accent,
    },
    headerTintColor: theme.colors.white,
    title: 'Select Contact',
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      contacts: [],
      hasPermission: false,
      loading: true,
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
    this.setState({ contacts: data, loading: false })
  }

  handleSelect = contact => {
    const callback = this.props.navigation.getParam('callback', null)
    if (!!callback) {
      callback(contact)
      this.props.navigation.goBack()
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Loader />
      )
    }

    return (
      <View style={ styles.container }>
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
