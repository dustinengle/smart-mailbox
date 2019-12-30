
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import React from 'react'

import Login from '../screen/Login'
import Register from '../screen/Register'

const Public = createStackNavigator(
  {
    Login,
    Register,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login',
    mode: 'modal',
  },
)

export default createAppContainer(Public)
