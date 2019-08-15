
import Colors from '../constants/Colors'
import React from 'react'
import Storage from '../constants/Storage'

import { clearItem } from '../lib/Storage'

import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default class LogoutScreen extends React.Component {
  _onLogout = () => {
    clearItem(Storage.TOKEN)
    this.props.navigation.navigate('AuthLoadingScreen')
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={styles.contentContainer}>
          <Text>
            If you logout you will need to login again to access your data.  
            Are you sure you want to logout?
          </Text>
          <Button
            onPress={ ev => this._onLogout() }
            style={ styles.button }
            title='Yes' />
        </View>
      </View>
    )
  }
}

LogoutScreen.navigationOptions = {
  title: 'Logout',
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    marginTop: 24,
  },
  actionContainer: {
    backgroundColor: Colors.actionBackground,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  actionText: {
    color: Colors.tintColor,
    fontSize: 12,
    height: 28,
    lineHeight: 28,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 30,
  },
})