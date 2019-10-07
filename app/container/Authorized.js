
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { ICON } from '../core/Constants'
import React from 'react'

import AttachModalScreen from '../screen/AttachModal'
import BarcodeModalScreen from '../screen/BarcodeModal'
import ContactModalScreen from '../screen/ContactModal'
import DashboardScreen from '../screen/Dashboard'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MailboxScreen from '../screen/Mailbox'
import PINModalScreen from '../screen/PINModal'
import RenameModalScreen from '../screen/RenameModal'
import SettingsScreen from '../screen/Settings'
import UserScreen from '../screen/User'
import UserModalScreen from '../screen/UserModal'
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
        tabBarIcon: getIcon(ICON.DASHBOARD),
      },
      screen: createStackNavigator({
        Dashboard: DashboardScreen,
        AttachModal: AttachModalScreen,
        BarcodeModal: BarcodeModalScreen,
      }),
    },
    Mailbox: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.MAILBOX),
      },
      screen: createStackNavigator({
        Mailbox: MailboxScreen,
        RenameModal: RenameModalScreen,
        PINModal: PINModalScreen,
        ContactModal: ContactModalScreen,
      }),
    },
    User: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.USER),
      },
      screen: createStackNavigator({
        User: UserScreen,
        UserModal: UserModalScreen,
        ContactModal: ContactModalScreen,
      }),
    },
    Wallet: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.WALLET),
      },
      screen: createStackNavigator({ Wallet: WalletScreen }),
    },
    Settings: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.SETTINGS),
      },
      screen: createStackNavigator({
        Settings: SettingsScreen,
        RenameModal: RenameModalScreen,
      }),
    },
  },
  {

  },
)

export default createAppContainer(Authorized)
