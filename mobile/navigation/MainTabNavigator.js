import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import DashboardScreen from '../screens/DashboardScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import LoginScreen from '../screens/LoginScreen';
import LogoutScreen from '../screens/LogoutScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabBarIcon from '../components/TabBarIcon';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

function createStack(name, comp) {
  const stack = createStackNavigator({ [name]: comp }, config)

  stack.navigationOptions = {
    tabBarLabel: name,
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={ focused }
        name={
          Platform.OS === 'ios'
            ? `ios-information-circle${ focused ? '' : '-outline' }`
            : 'md-information-circle'
        } />
    )
  }

  stack.path = ''

  return stack
}

const stacks = {
  Register: createStack('Register', RegisterScreen),
  Login: createStack('Login', LoginScreen),
  Logout: createStack('Logout', LogoutScreen),
  Dashboard: createStack('Dashboard', DashboardScreen),
  Delivery: createStack('Delivery', DeliveryScreen),
  Settings: createStack('Settings', SettingsScreen)
}

const tabNavigator = createBottomTabNavigator(stacks);

tabNavigator.path = '';

export default tabNavigator;
