
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import React from 'react'

import DashboardScreen from '../screen/Dashboard'
import GatewayScreen from '../screen/Gateway'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MailboxScreen from '../screen/Mailbox'
import SettingsScreen from '../screen/Settings'
import UserScreen from '../screen/User'
import WalletScreen from '../screen/Wallet'

function getIcon(name) {
  return ({ focused, horizontal, tintColor }) => {
    return (
      <Icon
        color={ tintColor }
        name={ `${ name }${ focused ? '' : '-outline' }` }
        size={ 24 } />
    )
  }
}

const Authorized = createBottomTabNavigator(
  {
    Dashboard: {
      navigationOptions: {
        tabBarIcon: getIcon('view-dashboard'),
      },
      screen: createStackNavigator({ Dashboard: DashboardScreen }),
    },
    Gateway: {
      navigationOptions: {
        tabBarIcon: getIcon('console-network'),
      },
      screen: createStackNavigator({ Gateway: GatewayScreen }),
    },
    Mailbox: {
      navigationOptions: {
        tabBarIcon: getIcon('mailbox'),
      },
      screen: createStackNavigator({ Mailbox: MailboxScreen }),
    },
    User: {
      navigationOptions: {
        tabBarIcon: getIcon('account-group'),
      },
      screen: createStackNavigator({ User: UserScreen }),
    },
    Wallet: {
      navigationOptions: {
        tabBarIcon: getIcon('wallet'),
      },
      screen: createStackNavigator({ Wallet: WalletScreen }),
    },
    Settings: {
      navigationOptions: {
        tabBarIcon: getIcon('settings'),
      },
      screen: createStackNavigator({ Settings: SettingsScreen }),
    },
  },
  {

  },
)

export default createAppContainer(Authorized)
