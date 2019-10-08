
import * as AppAuth from 'expo-app-auth'
import Component from '../core/Component'
import { connect } from 'react-redux'
import { postLogin } from '../core/Actions'
import React from 'react'
import { styles } from '../core/Style'

import { Button } from 'react-native-paper'
import EmailInput from '../component/form/Email'
import Logo from '../component/Logo'
import PasswordInput from '../component/form/Password'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import SubmitButton from '../component/form/Submit'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: props.me.email,
      password: '',
    }
  }

  handleChange = (k, v) => this.setState({ [k]: v })

  handleGoogle = async () => {
    const config = {
      issuer: 'https://accounts.google.com',
      clientId: Platform.OS === 'ios'
        ? '146829016638-amvla46rmk87o33d5gdmp7n030t8imm4.apps.googleusercontent.com'
        : '146829016638-4c0srrrg1m1ihtbncioa1vue81sjrjt9.apps.googleusercontent.com',
      scopes: ['email', 'profile', 'openid'],
    };

    const tokenResponse = await AppAuth.authAsync(config)
    console.log(tokenResponse)
    const result = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
    }).then(res => res.json())
    console.log('google response:', result)
  }

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
            <Button
              mode="outlined"
              onPress={ this.handleGoogle }
              style={ styles.button }>
              Login with Google
            </Button>
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
  me: state.me,
})

export default connect(mapState, mapDispatch)(Login)
