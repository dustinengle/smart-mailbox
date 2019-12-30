
import { connect } from 'react-redux'
import { KEY, getItem } from '../core/Storage'
import { postRegister } from '../core/Actions'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import Form, { TYPE } from '../component/Form'
import { Image, Keyboard, Text, TouchableHighlight, View } from 'react-native'
import Screen from '../component/Screen'

class Register extends React.PureComponent {
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
    if (!!user) this.setState({ email: user.email || '', name: user.name || '' })
  }

  componentWillUnmount() {
    this.keyboardHide.remove()
    this.keyboardShow.remove()
  }

  handleKeyboardHide = () => this.setState({ keyboardShown: false })

  handleKeyboardShow = () => this.setState({ keyboardShown: true })

  handleRegister = v => this.props.dispatchPostRegister(v).then(() => {
    this.props.navigation.navigate('Login')
  })

  handleLogin = () => this.props.navigation.navigate('Login')

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
              fields={[TYPE.NAME, TYPE.EMAIL, TYPE.PASSWORD, TYPE.CONFIRM]}
              onSubmit={ this.handleRegister }
              title="Register" />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableHighlight
                onPress={ this.handleLogin }
                style={{ marginTop: 20 }}
                underlayColor={ COLOR.ACCENT }>
                <Text>Already have an account? LOGIN</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostRegister: v => dispatch(postRegister(v)),
})

const mapProps = state => ({

})

export default connect(mapProps, mapDispatch)(Register)
