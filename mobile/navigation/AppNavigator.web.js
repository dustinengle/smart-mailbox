
import { createBrowserApp } from '@react-navigation/web'
import { createSwitchNavigator } from 'react-navigation'

import AppDrawerNavigator from './AppDrawerNavigator'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import AuthTabNavigator from './AuthTabNavigator'

const switchNavigator = createSwitchNavigator(
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

switchNavigator.path = ''

export default createBrowserApp(switchNavigator, { history: 'hash' })
