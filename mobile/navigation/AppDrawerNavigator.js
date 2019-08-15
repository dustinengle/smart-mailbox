
import Colors from '../constants/Colors'
import React from 'react'

import { createDrawerNavigator } from 'react-navigation'

import DashboardScreen from '../screens/DashboardScreen'
import ChannelsScreen from '../screens/ChannelsScreen'
import ConnectScreen from '../screens/ConnectScreen'
import LogoutScreen from '../screens/LogoutScreen'
import MessagesScreen from '../screens/MessagesScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ThingsScreen from '../screens/ThingsScreen'

const stacks = {
  Dashboard: DashboardScreen,
  Things: ThingsScreen,
  Channels: ChannelsScreen,
  Connect: ConnectScreen,
  Messages: MessagesScreen,
  Settings: SettingsScreen,
  Logout: LogoutScreen,
}

export default createDrawerNavigator(stacks, {
  hideStatusBar: true,
  drawerBackgroundColor: Colors.tabBar,
  overlayColor: Colors.tintColor,
  contentOptions: {
    activeTintColor: '#fff',
    activeBackgroundColor: Colors.tintColor,
  },
})
