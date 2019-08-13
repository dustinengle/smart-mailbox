
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

class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = { 
      active: {
        login: true,
        gateway: false,
        mailbox: false,
      },
      confirm: '', 
      email: '', 
      gateway: '',
      pass: '', 
      sn: 0,
    }
  }

  _onSetActive = (section) => {
    const active = {
      login: false,
      gateway: false,
      mailbox: false,
    }
    active[section] = true
    this.setState({ active })
  }

  _onSubmitGateway = () => {
    Alert.alert('Success', 'Gateway information submitted successfully.')
    this._onSetActive('mailbox')
  }

  _onSubmitMailbox = () => {
    Alert.alert('Success', 'Mailbox information submitted successfully.')
    this.props.navigation.navigate('Dashboard')
  }

  _onSubmitRegister = () => {
    this.props.login(this.state.email, this.state.pass)
      .then(res => {
        Alert.alert('Success', 'Login information submitted successfully.')
        this._onSetActive('gateway')
      })
      .catch(err => Alert.alert('Error', err))
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView
          style={ styles.container }
          contentContainerStyle={ styles.contentContainer }>
          { this.state.active.login && 
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
              <TextInput 
                autoCompleteType="password"
                onChangeText={ confirm => this.setState({ confirm }) } 
                placeholder="Confirm Password"
                secureTextEntry={ true }
                style={ styles.input }
                value={ this.state.confirm } />
              <Button
                onPress={ this._onSubmitRegister }
                style={ styles.button }
                title="Create Login" />
            </View>
          }
          { this.state.active.gateway &&
            <View>
              <MonoText>Gateway Registration</MonoText>
              <TextInput 
                keyboardType="ascii-capable"
                onChangeText={ gateway => this.setState({ gateway }) } 
                placeholder="Gateway ID"
                style={ styles.input } />
              <Button
                onPress={ this._onSubmitGateway }
                style={ styles.button }
                title="Register Gateway" />
            </View>
          }
          { this.state.active.mailbox && 
            <View>
              <MonoText>Mailbox Registration</MonoText>
              <TextInput 
                keyboardType="number-pad"
                onChangeText={ sn => this.setState({ sn }) } 
                placeholder="Serial Number"
                style={ styles.input } />
              <Button
                onPress={ this._onSubmitMailbox }
                style={ styles.button }
                title="Register Mailbox" />
            </View>
          }
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
  login: (email, pass) => fetchLogin(email, pass)(dispatch),
})

const mapStateToProps = state => ({
  email: state.email,
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)