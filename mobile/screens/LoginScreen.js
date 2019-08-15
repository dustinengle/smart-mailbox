
import Colors from '../constants/Colors'
import React from 'react'
import Storage from '../constants/Storage'

import { connect } from 'react-redux'
import { fetchLogin } from '../lib/Actions'
import { getItem } from '../lib/Storage'

import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = { 
      email: '', 
      errors: { email: null, pass: null },
      pass: '',
    }
  }

  async componentDidMount() {
    const email = await getItem(Storage.EMAIL)
    this.setState({ email })
  }

  _onChange = (k, v) => this.setState({ [k]: v }, this._validate)

  _onSubmitLogin = () => {
    this._validate(() => {
      const { email, pass } = this.state.errors
      if (email || pass) return

      this.props.login(this.state.email, this.state.pass)
        .then(res => {
          Alert.alert('Success', 'Login information submitted successfully.')
          this.props.navigation.navigate('Dashboard')
        })
        .catch(err => Alert.alert('Error', err))
    })
  }

  _validate = (cb) => {
    const errors = { email: null, pass: null }
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
            <Text>Login Information</Text>
            <TextInput 
              autoCompleteType="email"
              keyboardType="email-address"
              onChangeText={ v => this._onChange('email', v) } 
              placeholder="Email Address"
              style={ styles.input }
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
            <Button
              onPress={ this._onSubmitLogin }
              style={ styles.button }
              title="Create Login" />
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
  login: (email, pass) => fetchLogin(email, pass)(dispatch),
})

const mapStateToProps = state => ({
  email: state.email,
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)