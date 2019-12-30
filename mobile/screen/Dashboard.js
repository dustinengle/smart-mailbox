
import { connect } from 'react-redux'
import { getDetails, postMessage } from '../core/Actions'
import { getItem, KEY } from '../core/Storage'
import { ICON } from '../core/Constants'
import React from 'react'
import SenML from '../core/SenML'
import Styles from '../core/Styles'

import { Button } from 'react-native-elements'
import Component from '../core/Component'
import Icon from '../component/Icon'
import MailboxList from '../component/MailboxList'
import { RefreshControl, ScrollView, View } from 'react-native'
import Screen from '../component/Screen'

class Dashboard extends Component {
  async componentDidMount() {
    const token = await getItem(KEY.TOKEN)
    if (!token) {
      this.props.navigation.navigate('Login')
      return
    }

    this.props.dispatchGetDetails().then(this.toggleLoading)
  }

  handleMessage = data => {
    const senML = data.locked
      ? SenML.unlock(data.gateway.deviceId)
      : SenML.lock(data.gateway.deviceId)

    this.props.dispatchPostMessage({
      gatewayId: data.gateway.id,
      mailboxId: data.id,
      senML,
    })
  }

  render() {
    if (this.state.isLoading) {
      return this.renderLoading()
    }

    const items = this.props.mailboxes.map(mb => ({
      ...mb,
      gateway: this.props.gateways.find(gw => gw.id === mb.gatewayId),
    }))

    return (
      <Screen>
        <ScrollView
          refreshControl={(
            <RefreshControl refreshing={ this.state.isLoading } onRefresh={ this.refreshData } />
          )}
          style={ Styles.container }>
          <MailboxList
            items={ items }
            onLock={ this.handleMessage }
            onPIN={ this.handlePINModal } />
        </ScrollView>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchGetDetails: () => dispatch(getDetails()),
  dispatchPostMessage: v => dispatch(postMessage(v)),
})

const mapProps = state => ({
  gateways: state.gateways,
  mailboxes: state.mailboxes,
})

export default connect(mapProps, mapDispatch)(Dashboard)
