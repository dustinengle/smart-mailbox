
import Component from '../core/Component'
import { connect } from 'react-redux'
import { isWeb } from '../core/Device'
import { postMailboxPIN } from '../core/Actions'
import React from 'react'
import { styles, theme } from '../core/Style'

import { Button, Divider, Checkbox } from 'react-native-paper'
import EmailInput from '../component/form/Email'
import NameInput from '../component/form/Name'
import NumberInput from '../component/form/Number'
import PhoneInput from '../component/form/Phone'
import SubmitButton from '../component/form/Submit'
import { View } from 'react-native'

class PINModal extends Component {
  static getDerivedStateFromProps(props, state) {
    const data = props.navigation.getParam('data', null)
    if (!!data) {
      for (let [k, v] of Object.entries(data)) {
        if (!state[k] && !!v) state[k] = v
      }
      return state
    }
    return null
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: theme.colors.accent,
    },
    headerTintColor: theme.colors.white,
    title: 'Manage PIN',
  }

  handleSelect = contact => {
    this.setState({
      email: contact.email,
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
    })
  }

  handleSubmit = () => {
    const data = {
      accountId: this.props.me.accountId,
      email: this.state.email,
      mailboxId: this.state.mailboxId,
      name: this.state.name,
      number: parseInt(this.state.number, 10),
      phone: this.state.phone,
    }
    this.props.dispatchPostMailboxPIN(data)
      .then(() => this.props.navigation.goBack())
  }

  isValid = () => !!this.state.name && !!this.state.number

  toggleOpen = () => {
    this.props.navigation.navigate('ContactModal', { callback: this.handleSelect })
  }

  render() {
    return (
      <View key={ this.state.id || 0 } style={ styles.content }>
        <NameInput onChange={ v => this.handleChange('name', v) } value={ this.state.name } />
        <EmailInput onChange={ v => this.handleChange('email', v) } value={ this.state.email } />
        <PhoneInput onChange={ v => this.handleChange('phone', v) } value={ this.state.phone } />
        <NumberInput label="Number" onChange={ v => this.handleChange('number', v) } value={ this.state.number } />
        <Divider style={{ marginTop: 10 }} />
        { !isWeb() &&
          <Button onPress={ this.toggleOpen } style={ styles.button }>
            Add from Contacts
          </Button>
        }
        <SubmitButton disabled={ !this.isValid() } onSubmit={ this.handleSubmit } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostMailboxPIN: v => dispatch(postMailboxPIN(v)),
})

const mapState = state => ({
  me: state.me,
})

export default connect(mapState, mapDispatch)(PINModal)
