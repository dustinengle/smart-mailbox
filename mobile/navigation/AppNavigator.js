
import React from 'react'

import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import AppDrawerNavigator from './AppDrawerNavigator'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import AuthTabNavigator from './AuthTabNavigator'

export default createAppContainer(
  createSwitchNavigator(
    {
      App: AppDrawerNavigator,
      AuthLoadingScreen,
      Auth: AuthTabNavigator,
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      },
      initialRouteName: 'AuthLoadingScreen',
    }
  )
)
