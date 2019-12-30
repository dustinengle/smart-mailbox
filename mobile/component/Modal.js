
import { ICON } from '../core/Constants'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button } from 'react-native-elements'
import Icon from './Icon'
import { Keyboard, Modal, Text, View } from 'react-native'
import Screen from './Screen'

export default class CoreModal extends React.PureComponent {
  static defaultProps = {
    onClose: () => {},
    title: 'Unknown',
    visible: false,
  }

  state = {
    keyboardShown: false,
  }

  componentDidMount() {
    this.keyboardHide = Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide)
    this.keyboardShow = Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow)
  }

  componentWillUnmount() {
    this.keyboardHide.remove()
    this.keyboardShow.remove()
  }

  handleKeyboardHide = () => this.setState({ keyboardShown: false })

  handleKeyboardShow = () => this.setState({ keyboardShown: true })

  render() {
    return (
      <Screen>
        <Modal
          animationType="slide"
          transparent={ false }
          visible={ this.props.visible }
          onRequestClose={ this.props.onClose }>
          { !this.state.keyboardShown &&
            <View style={[Styles.flexRow, Styles.modalListHeader]}>
              <Text style={[Styles.flexFull, Styles.modalListTitle]}>
                { this.props.title }
              </Text>
              <Button
                icon={ (<Icon color={ COLOR.PRIMARY } name={ ICON.CLOSE } />) }
                onPress={ this.props.onClose }
                type="clear" />
            </View>
          }
          { this.props.children }
        </Modal>
      </Screen>
    )
  }
}
