
import { connect } from 'react-redux'
import { KEY, getItem } from '../core/Storage'
import { postLogin } from '../core/Actions'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import Form, { TYPE } from '../component/Form'
import { Image, Keyboard, Text, TouchableHighlight, View } from 'react-native'
import Screen from '../component/Screen'

class Login extends React.PureComponent {
  state = {
    keyboardShown: false,
  }

  async componentDidMount() {
    const token = await getItem(KEY.TOKEN)
    if (!!token) {
      this.props.navigation.navigate('Dashboard')
      return
    }

    this.keyboardHide = Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide)
    this.keyboardShow = Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow)

    const user = await getItem(KEY.USER)
    if (!!user) this.setState({ email: user.email || '' })
  }

  componentWillUnmount() {
    this.keyboardHide.remove()
    this.keyboardShow.remove()
  }

  handleKeyboardHide = () => this.setState({ keyboardShown: false })

  handleKeyboardShow = () => this.setState({ keyboardShown: true })

  handleLogin = v => this.props.dispatchPostLogin(v).then(() => {
    this.props.navigation.navigate('Dashboard')
  })

  handleRegister = () => this.props.navigation.navigate('Register')

  render() {
    const styles = [Styles.centered, Styles.modal]
    if (this.state.keyboardShown) styles.push({ justifyContent: 'flex-start', paddingTop: 40 })

    return (
      <Screen>
        <View style={ styles }>
          <View style={ Styles.modalContent }>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Image
                source={ require('../assets/images/mailbox.png') }
                style={ Styles.logo } />
            </View>
            <Form
              fields={[TYPE.EMAIL, TYPE.PASSWORD]}
              onSubmit={ this.handleLogin }
              title="Login" />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableHighlight
                onPress={ this.handleRegister }
                style={{ marginTop: 20 }}
                underlayColor={ COLOR.ACCENT }>
                <Text>Need to create an account? REGISTER</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostLogin: v => dispatch(postLogin(v)),
})

const mapProps = state => ({

})

export default connect(mapProps, mapDispatch)(Login)
