
import Colors from '../constants/Colors'
import React from 'react'

import { connect } from 'react-redux'
import { fetchCheckEmail, fetchRegister } from '../lib/Actions'

import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = { 
      confirm: '', 
      email: '', 
      errors: { confirm: null, email: null, pass: null },
      pass: '', 
    }
  }

  _onChange = (k, v) => this.setState({ [k]: v }, this._validate)

  _onSubmitRegister = () => {
    this._validate(() => {
      const { confirm, email, pass } = this.state.errors
      if (confirm || email || pass) return

      this.props.register(this.state.email, this.state.pass)
        .then(res => {
          Alert.alert('Success', 'New account created.')
          this.props.navigation.navigate('Dashboard')
        })
        .catch(err => Alert.alert('Error', err))
    })
  }

  _validate = (cb) => {
    const errors = { confirm: null, email: null, pass: null }
    if (!this.state.confirm || this.state.confirm !== this.state.pass) {
      errors.confirm = 'Passwords do not match.'
    }
    if (!this.state.email) {
      errors.email = 'Email address required.'
    }
    if (!this.state.pass) {
      errors.pass = 'Password is required.'
    }
    this.setState({ errors }, cb)
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView
          style={ styles.container }
          contentContainerStyle={ styles.contentContainer }>
            <View>
              <Text>Register Account</Text>
              <TextInput 
                autoCompleteType="email"
                keyboardType="email-address"
                onChangeText={ v => this._onSubmitEmail(v) } 
                placeholder="Email Address"
                style={ this.state.errors.email ? styles.inputWithError : styles.input }
                value={ this.state.email } />
              { this.state.errors.email && 
                <Text style={ styles.inputErrorText }>{ this.state.errors.email }</Text> 
              }
              <TextInput 
                autoCompleteType="password" 
                onChangeText={ v => this._onChange('pass', v) } 
                placeholder="Password"
                secureTextEntry={ true }
                style={ styles.input }
                value={ this.state.pass } />
              { this.state.errors.pass && 
                <Text style={ styles.inputErrorText }>{ this.state.errors.pass }</Text> 
              }  
              <TextInput 
                autoCompleteType="password"
                onChangeText={ v => this._onChange('confirm', v) } 
                placeholder="Confirm Password"
                secureTextEntry={ true }
                style={ styles.input }
                value={ this.state.confirm } />
              { this.state.errors.confirm && 
                <Text style={ styles.inputErrorText }>{ this.state.errors.confirm }</Text> 
              }
              <Button
                onPress={ this._onSubmitRegister }
                style={ styles.button }
                title="Register Account" />
            </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 30,
  },
  button: {
    marginTop: 30,
  },
  input: {
    padding: 10,
  },
  inputErrorText: {
    color: 'red',
    padding: 2,
  },
  inputWithError: {
    color: Colors.errorText,
    backgroundColor: Colors.errorBackground,
    borderColor: Colors.errorBackground,
    padding: 10,
  },
})

const mapDispatchToProps = dispatch => ({
  checkEmail: email => fetchCheckEmail(email)(dispatch),
  register: (email, pass) => fetchRegister(email, pass)(dispatch),
})

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)