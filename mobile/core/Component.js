
import { COLOR } from './Styles'
import config from '../package.json'
import { getItem, KEY } from '../core/Storage'
import React from 'react'

import { ActivityIndicator, Alert, Text } from 'react-native'

export default class Component extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const modalRoutes = new Set([
      'Login',
      'Register',
    ])

    const route = navigation.state.routeName
    if (modalRoutes.has(route)) {
      return {
        headerMode: 'none',
        initialRouteName: 'Login',
        mode: 'modal',
        title: route,
      }
    }

    return {
      headerRight: () => (
        <Text style={{ color: COLOR.HALF_WHITE, paddingRight: 10 }}>
          v{ config.version }
        </Text>
      ),
      headerStyle: {
        backgroundColor: COLOR.PRIMARY,
        margin: 0,
        width: '100%',
      },
      headerTitleStyle: {
        color: COLOR.WHITE,
        left: 0,
        margin: 0,
      },
      title: "It's Here",
    }
  }

  state = {
    data: {},
    isLoading: true,
    showForm: false,
    showList: false,
  }

  async componentDidMount() {
    const token = await getItem(KEY.TOKEN)
    if (!token && !!this.props.navigation) {
      this.props.navigation.navigate('Login')
      return
    }

    if (!!this.props.dispatchGetDetails) {
      this.props.dispatchGetDetails().then(this.toggleLoading)
    }
  }

  confirm = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Confirm',
        'This action cannot be reversed, continue?',
        [
          { onPress: () => resolve(false), style: 'cancel', text: 'No' },
          { onPress: () => resolve(true), text: 'Yes' },
        ],
        { cancelable: false }
      )
    })
  }

  handleClose = () => this.setState(
    { data: {}, isLoading: true, showForm: false, showList: false },
    this.refreshData,
  )

  refreshData = () => this.setState({ isLoading: true }, () => {
    this.props.dispatchGetDetails().then(this.toggleLoading)
  })

  renderLoading = () => (<ActivityIndicator />)

  toggleLoading = () => this.setState({ isLoading: !this.state.isLoading })

  render() {
    return null
  }
}
