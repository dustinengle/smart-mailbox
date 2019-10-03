
import React from 'react'
import { theme } from './Style'

import Appbar from '../component/Appbar'

export default class Component extends React.PureComponent {
  static getDerivedStateFromProps(props, state) {
    if (props.data) {
      for (let [k, v] of Object.defineProperties(props.data)) {
        state[k] = v
      }
      return state
    }
    return null
  }

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const modalRoutes = new Set(['Login', 'Register'])
    const route = navigation.state.routeName
    if (modalRoutes.has(route)) {
      return {
        headerMode: 'none',
        initialRouteName: 'Dashboard',
        mode: 'modal',
      }
    }

    return {
      headerLeft: null,
      headerStyle: {
        backgroundColor: theme.colors.primary,
        height: 56,
        margin: 0,
        width: '100vw',
      },
      headerTitle: (<Appbar onGo={ r => navigation.navigate(r) } />),
      headerTitleStyle: {
        left: 0,
        margin: 0,
        padding: 0,
      },
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      open: false,
    }
  }

  handleChange = (k, v) => this.setState({ [k]: v })

  handleEdit = data => this.setState({ data })

  toggleOpen = (data = null) => this.setState({ data, open: !this.state.open })

  render() {
    return null
  }
}
