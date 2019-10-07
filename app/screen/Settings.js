
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { postUser } from '../core/Actions'
import { styles } from '../core/Style'

import { Button, Divider } from 'react-native-paper'
import EmailInput from '../component/form/Email'
import NameInput from '../component/form/Name'
import PhoneInput from '../component/form/Phone'
import SubmitButton from '../component/form/Submit'
import { View } from 'react-native'

class Settings extends Component {
  static getDerivedStateFromProps(props, state) {
    if (!!props.me && !state.id) {
      for (let [k, v] of Object.entries(props.me)) {
        state[k] = v
      }
      return state
    }
    return null
  }

  handleSubmit = () => {
    const data = {
      id: this.state.id,
      email: this.state.email,
      name: this.state.name,
      phone: this.state.phone,
    }
    this.props.dispatchPostUser(data)
      .then(() => this.props.navigation.goBack())
  }

  isValid = () => !!this.state.name && !!this.state.email

  render() {
    return (
      <View style={ styles.content }>
        <NameInput onChange={ v => this.handleChange('name', v) } value={ this.state.name } />
        <EmailInput onChange={ v => this.handleChange('email', v) } value={ this.state.email } />
        <PhoneInput onChange={ v => this.handleChange('phone', v) } value={ this.state.phone } />
        <Divider style={{ marginTop: 10 }} />
        <SubmitButton disabled={ !this.isValid() } onSubmit={ this.handleSubmit } />
        <Divider style={{ marginTop: 10 }} />
        <Button
          mode="outlined"
          onPress={ () => this.props.navigation.navigate('Login') }
          style={ styles.button }>
          Logout
        </Button>
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostUser: v => dispatch(postUser(v)),
})

const mapState = state => ({
  me: state.me,
})

export default connect(mapState, mapDispatch)(Settings)