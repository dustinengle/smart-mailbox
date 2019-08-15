import React from 'react'
import { Platform } from 'react-native'

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import TabBarIcon from '../components/TabBarIcon'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
})

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
    Login: createStack('Login', LoginScreen),
    Register: createStack('Register', RegisterScreen),
}

const tabNavigator = createBottomTabNavigator(stacks)

tabNavigator.path = ''

export default tabNavigator
