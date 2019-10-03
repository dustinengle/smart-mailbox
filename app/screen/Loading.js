
import { alert, postLogin } from '../core/Actions'
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import { ActivityIndicator } from 'react-native-paper'
import { Text, View } from 'react-native'

class Loading extends Component {
  componentDidMount() {
    setTimeout(() => {
      const { me, token } = this.props

      if (!token && !!me.email && !!me.password) {
        this.props.dispatchPostLogin({ email: me.email, password: me.password })
          .then(() => this.handleDashboard())
          .catch(() => this.handleLogin())
        return
      } else if (!!token) {
        this.handleDashboard()
        return
      }

      this.props.dispatchAlert({ message: 'This is a test!', title: 'Notice' })

      this.handleLogin()
    }, 3000)
  }

  handleDashboard = () => this.props.navigation.navigate('Dashboard')

  handleLogin = () => this.props.navigation.navigate('Login')

  render() {
    const style = [
      styles.container,
      styles.flexColumn,
      styles.flexFull,
      styles.spaceAround,
    ]

    return (
      <View style={ style }>
        <View style={ styles.center }>
          <ActivityIndicator size="large" style={ styles.margins } />
          <Text style={ styles.center }>Loading</Text>
        </View>
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchAlert: v => dispatch(alert(v)),
  dispatchPostLogin: v => dispatch(postLogin(v)),
})

const mapState = state => ({
  account: state.account,
  connected: state.connected,
  me: state.me,
  token: state.token,
})

export default connect(mapState, mapDispatch)(Loading)
