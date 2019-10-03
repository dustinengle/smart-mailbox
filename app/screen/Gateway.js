
import Component from '../core/Component'
import { connect } from 'react-redux'
import Constants from 'expo-constants'
import React from 'react'
import { styles } from '../core/Style'

import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, Card, Modal, Portal, Subheading } from 'react-native-paper'
import GatewayList from '../component/list/Gateway'
import NameInput from '../component/form/Name'
import * as Permissions from 'expo-permissions';
import { Text, View } from 'react-native'

class Gateway extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      hasCameraPermission: null,
      scanned: false,
    }
  }

  async componentDidMount() {
    this.getPermissionsAsync()
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true })
    alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  handleSave = () => {
    console.log('save:', this.state)
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const rows = this.props.mailboxes.map(o => ({
      ...o,
      mailbox: this.props.mailboxes.find(v => v.id === o.mailboxId),
    }))

    return (
      <View style={ styles.content }>
        <Portal>
          <Modal
            contentContainerStyle={ styles.modal }
            onDismiss={ this.toggleOpen }
            visible={ this.state.open }>
            <Card>
              <Card.Title
                subtitle={ this.state.id ? 'Update' : 'Create' }
                title="Gateway" />
              <Card.Content>
                <NameInput
                  onChange={ v => this.handleChange('name', v) }
                  value={ this.state.name } />
                  <BarCodeScanner
                    onBarCodeScanned={ scanned ? undefined : this.handleBarCodeScanned }
                    style={ StyleSheet.absoluteFillObject } />

                  {scanned &&
                    <Button
                      onPress={ () => this.setState({ scanned: false }) }
                      title={ 'Tap to Scan Again' } />
                  }
              </Card.Content>
              <Card.Actions>
                <Button onPress={ this.handleSave }>Save</Button>
                <Button onPress={ this.toggleOpen }>Cancel</Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>
        <View style={ styles.flexRow }>
          <Subheading>Gateway</Subheading>
          <View style={ styles.flexFull } />
          <Button icon="add" onPress={ this.toggleOpen }>Create</Button>
        </View>
        <GatewayList onEdit={ this.handleEdit } rows={ rows } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({
  gateways: state.gateways,
  mailboxes: state.mailboxes,
})

export default connect(mapState, mapDispatch)(Gateway)
