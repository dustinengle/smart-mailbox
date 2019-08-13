
import { connect } from 'react-redux'
import { fetchLogin } from '../lib/Actions'
import React from 'react'
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import { MonoText } from '../components/StyledText'

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = { 
      email: '', 
      pass: '',
    }
  }

  onSubmitLogin = () => {
    this.props.login(this.state.email, this.state.pass)
      .then(res => {
        Alert.alert('Success', 'Login information submitted successfully.')
        this._onSetActive('gateway')
      })
      .catch(err => Alert.alert('Error', err.message))
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView
          style={ styles.container }
          contentContainerStyle={ styles.contentContainer }>
          <View>
            <MonoText>Login Information</MonoText>
            <MonoText>{ this.props.email }</MonoText>
            <TextInput 
              autoCompleteType="email"
              keyboardType="email-address"
              onChangeText={ email => this.setState({ email }) } 
              placeholder="Email Address"
              style={ styles.input }
              value={ this.state.email } />
            <TextInput 
              autoCompleteType="password" 
              onChangeText={ pass => this.setState({ pass }) } 
              placeholder="Password"
              secureTextEntry={ true }
              style={ styles.input }
              value={ this.state.pass } />
            <Button
              onPress={ this.onSubmitLogin }
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
})

const mapDispatchToProps = dispatch => ({
  login: (email, pass) => dispatch(fetchLogin(email, pass)),
})

const mapStateToProps = state => ({
  email: state.email,
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)