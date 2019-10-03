
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import EmailInput from '../component/form/Email'
import Logo from '../component/Logo'
import PasswordInput from '../component/form/Password'
import { postLogin } from '../core/Actions'
import SubmitButton from '../component/form/Submit'
import { Text, TouchableOpacity, View } from 'react-native'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: 'john.doe@email.com',
      password: 'Password!1',
    }
  }

  handleChange = (k, v) => this.setState({ [k]: v })

  handleLogin = () => {
    const data = {
      email: this.state.email,
      password: this.state.password,
    }
    this.props.dispatchPostLogin(data)
      .then(res => this.props.navigation.navigate('Dashboard'))
  }

  handleRegister = () => {
    this.props.navigation.navigate('Register')
  }

  isValid = () => !!this.state.email && !!this.state.password

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
            <Logo />
            <Text style={ styles.textCenter }>Login</Text>
            <EmailInput onChange={ v => this.handleChange('email', v) } value={ this.state.email } />
            <PasswordInput onChange={ v => this.handleChange('password', v) } value={ this.state.password } />
            <SubmitButton disabled={ !this.isValid() } onSubmit={ this.handleLogin } />
            <View style={{ marginTop: 30 }} />
            <Text style={[styles.textCenter, styles.margins]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={this.handleRegister} style={ styles.margins }>
              <Text style={[styles.textCenter, styles.textPrimary]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostLogin: v => dispatch(postLogin(v)),
})

const mapState = state => ({

})

export default connect(mapState, mapDispatch)(Login)
