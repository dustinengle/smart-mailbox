
import React from 'react'

import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import { Reducers } from './lib/Reducers'
import thunk from 'redux-thunk'

import SmartMailbox from './SmartMailbox'

const store = createStore(
  combineReducers(Reducers),
  applyMiddleware(createLogger(), thunk),
)

const App = () => (
  <Provider store={ store }>
    <SmartMailbox />
  </Provider>
)

export default App
