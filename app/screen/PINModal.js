
import Component from '../core/Component'
import { connect } from 'react-redux'
import { isWeb } from '../core/Device'
import { postUser } from '../core/Actions'
import React from 'react'
import { styles } from '../core/Style'

import { Button, Divider, Checkbox } from 'react-native-paper'
import EmailInput from '../component/form/Email'
import NameInput from '../component/form/Name'
import PhoneInput from '../component/form/Phone'
import SubmitButton from '../component/form/Submit'
import { View } from 'react-native'

class PINModal extends Component {
  static navigationOptions = {
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
      email: this.state.email,
      name: this.state.name,
      phone: this.state.phone,
    }
    this.props.dispatchPostUser(data)
      .then(() => this.props.navigation.goBack())
  }

  isValid = () => !!this.state.name && !!this.state.number && (!!this.state.email || !!this.state.phone)

  toggleOpen = () => {
    this.props.navigation.navigate('ContactModal', { callback: this.handleSelect })
  }

  render() {
    return (
      <View key={ this.state.id || 0 } style={ styles.content }>
        <NameInput onChange={ v => this.handleChange('name', v) } value={ this.state.name } />
        <EmailInput onChange={ v => this.handleChange('email', v) } value={ this.state.email } />
        <PhoneInput onChange={ v => this.handleChange('phone', v) } value={ this.state.phone } />
        <NameInput label="Number" onChange={ v => this.handleChange('number', v) } value={ this.state.number } />
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
  dispatchPostUser: v => dispatch(postUser(v)),
})

const mapState = state => ({

})

export default connect(mapState, mapDispatch)(PINModal)
