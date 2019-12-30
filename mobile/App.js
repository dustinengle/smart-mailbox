

import { applyMiddleware, createStore } from 'redux'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createLogger } from 'redux-logger'
import * as Font from 'expo-font'
import { Platform } from 'react-native'
import React from 'react'
import Reducers from './core/Reducers'
import thunk from 'redux-thunk'
import { useScreens } from 'react-native-screens'

import { AppLoading } from 'expo'
import Private from './navigator/Private'
import Public from './navigator/Public'
import { Provider as StoreProvider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'react-native-elements'

// Enable screens with navigation.
useScreens()

// Setup middleware.
const mw = [thunk]
if (Platform.OS === 'web') mw.push(createLogger())

const store = createStore(Reducers, applyMiddleware(...mw))

const Root = createAppContainer(
  createSwitchNavigator(
    {
      Private,
      Public,
    },
    {
      initialRouteName: 'Public',
    },
  ),
)

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isReady: true }
  }

  async _cacheResourcesAsync() {
    const fonts = Font.loadAsync({
      'modelica': require('./assets/fonts/BwModelica-Regular.otf'),
      'modelica-bold': require('./assets/fonts/BwModelica-Bold.otf'),
      'modelica-italic': require('./assets/fonts/BwModelica-RegularItalic.otf'),
      'modelica-light': require('./assets/fonts/BwModelica-Light.otf'),
    })

    const images = [
      require('./assets/images/gradient.png'),
      require('./assets/images/icon.png'),
      require('./assets/images/mailbox.png'),
      require('./assets/images/mailbox_white.png'),
    ]
    const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync())
    return Promise.all([ fonts, ...cacheImages ])
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={ this._cacheResourcesAsync }
          onFinish={ () => this.setState({ isReady: true }) }
          onError={ console.warn } />
      )
    }

    return (
      <StoreProvider store={ store }>
        <SafeAreaProvider>
          <ThemeProvider>
            <Root />
          </ThemeProvider>
        </SafeAreaProvider>
      </StoreProvider>
    )
  }
}
