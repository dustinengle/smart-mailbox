
import React from 'react'
import * as Permissions from 'expo-permissions'
import Styles from '../core/Styles'

import { BarCodeScanner } from 'expo-barcode-scanner'
import { Button, Text, View } from 'react-native'
import Component from '../core/Component'
import Screen from './Screen'

export default class Scanner extends Component {
  constructor(props) {
    super(props)
    this.state.hasCameraPermission = null
    this.state.scanned = false
  }

  async componentDidMount() {
    this.getPermissionsAsync()
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  handleBarCodeScanned = ({ data }) => {
    this.setState({ scanned: true }, () => this.props.onScan(data))
  }

  render() {
    const { hasCameraPermission, scanned } = this.state

    if (hasCameraPermission === null) {
      return (<Text>Requesting for camera permission</Text>)
    }

    if (hasCameraPermission === false) {
      return (<Text>No access to camera</Text>)
    }

    return (
      <Screen>
        <View style={[Styles.container, Styles.modal]}>
          <BarCodeScanner
            onBarCodeScanned={ scanned ? undefined : this.handleBarCodeScanned }
            style={{ flex: 1 }} />
          { scanned &&
            <Button
              onPress={ () => this.setState({ scanned: false }) }
              title="Tap to Scan Again" />
          }
        </View>
      </Screen>
    )
  }
}
