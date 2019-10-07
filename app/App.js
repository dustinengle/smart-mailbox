
import { ACTION, STORE } from './core/Constants'
import { addConnectedListener, isConnected } from './core/Device'
import { applyMiddleware, createStore } from 'redux'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createLogger } from 'redux-logger'
import { isWeb } from './core/Device'
import React from 'react';
import Reducers from './core/Reducers'
import Storage from './core/Storage'
import { theme } from './core/Style'
import thunk from 'redux-thunk';

import Authorized from './container/Authorized'
import LoadingScreen from './screen/Loading'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider as StoreProvider } from 'react-redux'
import Unauthorized from './container/Unauthorized'

const middleware = isWeb() ? applyMiddleware(createLogger(), thunk) : applyMiddleware(thunk)
const store = createStore(Reducers, middleware)

// Update the connection state in the store.
isConnected().then(payload => store.dispatch({ payload, type: ACTION.CONNECTED }))
// Add event listeners to update the state on change.
// Will return isConnected value as payload.
addConnectedListener(payload => {
  console.log('connectionChange event:', payload)
  store.dispatch({ payload, type: ACTION.CONNECTED })
})

// Load local data and push to the store.
Storage.get(STORE.TOKEN).then(payload => {
  if (!!payload) store.dispatch({ payload, type: ACTION.TOKEN })
})
Storage.get(STORE.USER).then(payload => {
  if (!!payload) store.dispatch({ payload, type: ACTION.USER })
})

// Setup a root component to load the switch nav.
const Root = createAppContainer(
  createSwitchNavigator({
    Authorized,
    Loading: LoadingScreen,
    Unauthorized,
  }, { initialRouteName: 'Loading' })
)

export default function App() {
  return (
    <StoreProvider store={ store }>
      <PaperProvider theme={ theme }>
        <Root />
      </PaperProvider>
    </StoreProvider>
  );
}
