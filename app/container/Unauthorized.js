
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import React from 'react'

import LoginScreen from '../screen/Login'
import RegisterScreen from '../screen/Register'

const Unauthorized = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login',
    mode: 'modal',
  },
)

export default createAppContainer(Unauthorized)
