import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import {
  Alert,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { MonoText } from '../components/StyledText'

export default class RegisterScreen extends React.Component {
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

  _onSubmitLogin = () => {
    Alert.alert('Success', 'Login information submitted successfully.')
    this._onSetActive('gateway')
  }

  _onSubmitMailbox = () => {
    Alert.alert('Success', 'Mailbox information submitted successfully.')
    this.props.navigation.navigate('Dashboard')
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
              <TextInput 
                autoCompleteType="email"
                keyboardType="email-address"
                onChangeText={ email => this.setState({ email }) } 
                placeholder="Email Address"
                style={ styles.input } />
              <TextInput 
                autoCompleteType="password" 
                onChangeText={ pass => this.setState({ pass }) } 
                placeholder="Password"
                secureTextEntry={ true }
                style={ styles.input } />
              <TextInput 
                autoCompleteType="password"
                onChangeText={ confirm => this.setState({ confirm }) } 
                placeholder="Confirm Password"
                secureTextEntry={ true }
                style={ styles.input } />
              <Button
                onPress={ this._onSubmitLogin }
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

RegisterScreen.navigationOptions = {
  header: null,
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
