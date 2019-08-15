
import React from 'react'
import Storage from '../constants/Storage'

import { getItem } from '../lib/Storage'

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const token = await getItem(Storage.TOKEN)
    console.log('AuthLoadingScreen.token:', token)
    setTimeout(() => this.props.navigation.navigate(!!token ? 'App' : 'Auth'), 1000)
  }

  render() {
    return (
      <View style={ styles.container }>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
        <Text style={ styles.message }>Checking for previous login...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1, 
    justifyContent: 'center', 
  },
  message: {
    color: 'gray',
    marginTop: 20,
  },
})