
import { COLOR } from '../core/Styles'
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { ICON } from '../core/Constants'
import React from 'react'

import Dashboard from '../screen/Dashboard'
import Gateways from '../screen/Gateways'
import Icon, { getIcon } from '../component/Icon'
import Mailboxes from '../screen/Mailboxes'
import Profile from '../screen/Profile'
import Users from '../screen/Users'
import Wallet from '../screen/Wallet'

const tabBarOptions = {
  activeBackgroundColor: COLOR.ACCENT,
  activeTintColor: COLOR.WHITE,
  inactiveBackgroundColor: COLOR.ACCENT,
  inactiveTintColor: COLOR.HALF_WHITE,
  style: {
    backgroundColor: COLOR.WHITE,
    borderWidth: 0,
  },
}

const Private = createBottomTabNavigator(
  {
    Dashboard: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.DASHBOARD),
      },
      screen: createStackNavigator({
        Dashboard: Dashboard,
      }),
    },
    Gateways: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.GATEWAY),
      },
      screen: createStackNavigator({
        Gateways: Gateways,
      }),
    },
    Mailboxes: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.MAILBOX),
      },
      screen: createStackNavigator({
        Mailboxes: Mailboxes,
      }),
    },
    Users: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.USER),
      },
      screen: createStackNavigator({
        Users: Users,
      }),
    },
    Wallet: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.WALLET),
      },
      screen: createStackNavigator({
        Wallet: Wallet,
      }),
    },
    Profile: {
      navigationOptions: {
        tabBarIcon: getIcon(ICON.SETTINGS),
      },
      screen: createStackNavigator({
        Profile: Profile,
      }),
    },
  },
  {
    tabBarOptions,
  },
)

export default createAppContainer(Private)
