
import Component from '../core/Component'
import React from 'react'
import { styles } from '../core/Style'

import { BarCodeScanner } from 'expo-barcode-scanner'
import { Button } from 'react-native-paper'
import * as Permissions from 'expo-permissions'
import { StyleSheet, Text, View } from 'react-native'

export default class BarcodeModal extends Component {
  static navigationOptions = {
    title: 'Scan Code',
  }

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      hasPermission: null,
      scanned: false,
    }
  }

  async componentDidMount() {
    this.getPermissionsAsync()
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasPermission: status === 'granted' })
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true }, () => {
      const callback = this.props.navigation.getParam('callback', null)
      if (!!callback) callback(data)
      this.props.navigation.goBack()
    })
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  render() {
    return (
      <View style={ styles.content }>
        { this.state.hasPermission === null &&
          <Text>Requesting for camera permission</Text>
        }
        { this.state.hasPermission === false &&
          <Text>No access to camera</Text>
        }
        { this.state.scanned &&
          <Button
            onPress={ () => this.setState({ scanned: false }) }
            style={ styles.button }>
            Tap to Scan Again
          </Button>
        }
        { this.state.hasPermission === true &&
          <BarCodeScanner
            onBarCodeScanned={ this.state.scanned ? undefined : this.handleBarCodeScanned }
            style={[StyleSheet.absoluteFillObject, styles.content, styles.scanner]} />
        }
      </View>
    )
  }
}
