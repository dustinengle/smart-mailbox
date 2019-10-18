
import Component from '../core/Component'
import { connect } from 'react-redux'
import { getAccountBalance, getAccountTotals } from '../core/Actions'
import QRCode from 'react-native-qrcode'
import React from 'react'
import { styles, theme } from '../core/Style'

import { Card } from 'react-native-paper'
import { ScrollView, RefreshControl, Text } from 'react-native'

class Wallet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      balance: '',
      refreshing: false,
      totals: {},
    }
  }

  componentDidMount() {
    this.props.dispatchGetAccountBalance().then(balance => this.setState({ balance, refreshing: false }))
    this.props.dispatchGetAccountTotals().then(res => {
      const totals = {}
      res.forEach(r => {
        totals[r.deviceId] = r
      })
      this.setState({ totals, refreshing: false })
    })
  }

  render() {
    let address = null
    let balance = null
    try {
      const parts = this.state.balance.replace('{', '').replace('}', '').split(': ')
      address = parts[0]
      if (parts.length > 1) balance = parts[1]
    } catch(err) {
      // Do nothing.
    }

    return (
      <ScrollView
        refreshControl={ (
          <RefreshControl
            refreshing={ this.state.refreshing }
            onRefresh={ () => this.setState({ refreshing: true }, this.componentDidMount) } />
        ) }
        style={[styles.flexColumn, styles.margins]}>
        <Card>
          <Card.Title
            title="StreamIOT Balance"
            titleStyle={{ color: theme.colors.accent, fontFamily: 'modelica-bold' }} />
          <Card.Content style={[styles.center, styles.flexColumn]}>
            <Text style={[styles.margins, styles.textHuge, styles.textWhite]}>
              Balance: { balance || '0.00000000' }
            </Text>
            { false &&
              <QRCode
                bgColor={ !address ? theme.colors.surface : theme.colors.black }
                fgColor={ !address ? theme.colors.surface : theme.colors.white }
                size={ 80 }
                value={ address } />
            }
          </Card.Content>
        </Card>
        { this.props.mailboxes.map(mailbox => (
          <Card key={ mailbox.id } style={[styles.margins]}>
            <Card.Title
              title={ mailbox.name }
              titleStyle={[styles.textAccent]} />
            <Card.Content style={[styles.center, styles.flexColumn]}>
              <Text style={[styles.textHuge, styles.textWhite]}>
                Balance: { this.state.totals[mailbox.deviceId]
                  ? this.state.totals[mailbox.deviceId].balance
                  : '0.00000000' }
              </Text>
            </Card.Content>
          </Card>
        )) }
      </ScrollView>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchGetAccountBalance: () => dispatch(getAccountBalance()),
  dispatchGetAccountTotals: () => dispatch(getAccountTotals()),
})

const mapState = state => ({
  account: state.account,
  mailboxes: state.mailboxes,
})

export default connect(mapState, mapDispatch)(Wallet)
