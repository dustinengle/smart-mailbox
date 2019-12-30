
import { connect } from 'react-redux'
import { getBalance, getTotals } from '../core/Actions'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button } from 'react-native-elements'
import Card, { CardAction } from '../component/Card'
import Component from '../core/Component'
import Form, { TYPE } from '../component/Form'
import Modal from '../component/Modal'
import QRCode from 'react-native-qrcode'
import Screen from '../component/Screen'
import { RefreshControl, ScrollView, Text, View } from 'react-native'

class Wallet extends Component {
  state = {
    data: {},
    isLoading: true,
    showForm: false,
    showList: false,

    // Local
    account: { address: '', balance: 0.0 },
    devices: [],
    qr: null,
  }

  componentDidMount() {
    this.loadData()
  }

  handleQR = qr => this.setState({ qr })

  loadData = () => {
    return Promise.all([
        this.props.dispatchGetBalance(),
        this.props.dispatchGetTotals(),
      ])
      .then(res => {
        this.toggleLoading()
        console.log('res:', res)
        const state = { ...this.state }
        if (!!res[0]) {
          // Setup the account information.
          const parts = res[0].substr(1, res[0].length - 1).split(': ')
          state.account = { address: parts[0], balance: parseFloat(parts[1]) }
        }
        if (!!res[1]) {
          // Process totals for devices.
        }
        this.setState(state)
        return res
      })
  }

  refreshData = () => this.setState({ isLoading: true }, () => {
    this.loadData().then(this.toggleLoading).catch(this.toggleLoading)
  })

  render() {
    return (
      <Screen>
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={ this.state.isLoading }
              onRefresh={ this.refreshData } />
          )}
          style={ Styles.container }>
          <Modal
            onClose={ () => this.setState({ qr: null }) }
            title="QR Code"
            visible={ !!this.state.qr }>
            <View style={ [Styles.center, Styles.modal] }>
              <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                <QRCode
                  value={ this.state.qr }
                  size={ 250 }
                  bgColor={ COLOR.BLACK }
                  fgColor={ COLOR.WHITE } />
                <View style={ Styles.modalContent }>
                  <Text style={{ color: COLOR.ACCENT, fontSize: 14, margin: 20, textAlign: 'center' }}>
                    Address:
                  </Text>
                  <Text style={{ color: COLOR.PRIMARY, fontSize: 18, textAlign: 'center' }}>
                    { this.state.qr }
                  </Text>
                </View>
              </View>
            </View>
          </Modal>
          <Card>
            <View style={{ alignItems: 'center' }}>
              <Text>Account:</Text>
              <Text style={{ color: COLOR.PRIMARY, fontSize: 20, textAlign: 'center' }}>
                { this.state.account.address }
              </Text>
              <Text style={{ color: COLOR.ACCENT, fontSize: 20, textAlign: 'center' }}>
                { this.state.account.balance } IOT
              </Text>
            </View>
            <CardAction
              onPress={ () => this.handleQR(this.state.account.address) }
              title="QR Code" />
          </Card>
        </ScrollView>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchGetBalance: () => dispatch(getBalance()),
  dispatchGetTotals: () => dispatch(getTotals()),
})

const mapProps = state => ({
  user: state.user,
})

export default connect(mapProps, mapDispatch)(Wallet)
