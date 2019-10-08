
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import EmailInput from '../component/form/Email'
import NameInput from '../component/form/Name'
import PasswordInput from '../component/form/Password'
import { postAccount } from '../core/Actions'
import SubmitButton from '../component/form/Submit'
import { Text, TouchableOpacity, View } from 'react-native'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.me.email,
      name: props.me.name,
      password: '',
    }
  }

  handleChange = (k, v) => this.setState({ [k]: v })

  handleLogin = () => {
    this.props.navigation.goBack()
  }

  handleRegister = () => {
    const data = {
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
    }
    this.props.dispatchPostRegister(data)
      .then(res => this.props.navigation.navigate('Login'))
  }

  isValid = () => !!this.state.email && !!this.state.name && !!this.state.password

  render() {
    const style = [
      styles.container,
      styles.flexColumn,
      styles.flexFull,
      styles.spaceAround,
    ]

    return (
      <View style={ style }>
        <View style={ styles.center }>
          <View style={{ width: '60%' }}>
            <Text style={ styles.textCenter }>Register</Text>
            <NameInput onChange={ v => this.handleChange('name', v) } value={ this.state.name } />
            <EmailInput onChange={ v => this.handleChange('email', v) } value={ this.state.email } />
            <PasswordInput onChange={ v => this.handleChange('password', v) } value={ this.state.password } />
            <SubmitButton disabled={ !this.isValid() } onSubmit={ this.handleRegister } />
            <View style={{ marginTop: 30 }} />
            <Text style={[styles.textCenter, styles.margins]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={this.handleLogin} style={ styles.margins }>
              <Text style={[styles.textCenter, styles.textPrimary]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostRegister: v => dispatch(postAccount(v)),
})

const mapState = state => ({
  me: state.me,
})

export default connect(mapState, mapDispatch)(Register)
