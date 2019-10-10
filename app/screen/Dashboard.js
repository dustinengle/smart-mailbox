
import Component from '../core/Component'
import { connect } from 'react-redux'
import { dismiss, getMailboxes } from '../core/Actions'
import { ICON } from '../core/Constants'
import React from 'react'
import { styles } from '../core/Style'

import Alert from '../component/Alert'
import { Button, Portal } from 'react-native-paper'
import Mailbox from '../component/Mailbox'
import { ScrollView, View } from 'react-native'

class Dashboard extends Component {
  componentDidMount() {
    if (!this.props.me.accountId) {
      this.props.navigation.navigate('Login')
      return
    }
    this.props.dispatchGetMailboxes()
  }

  handleDismiss = data => {
    console.log('dismiss alert:', data)
    this.props.dispatchDismiss(data)
  }

  toggleOpen = () => {
    this.props.navigation.navigate('AttachModal')
  }

  render() {
    console.log(this.props.alerts)
    const rows = this.props.mailboxes.map(o => ({
      ...o,
    }))

    return (
      <ScrollView style={[styles.content, styles.flexColumn]}>
        <Portal>
          { this.props.alerts.map(alert => (
            <Alert { ...alert } key={ alert.id } onDismiss={ this.handleDismiss } />
          )) }
        </Portal>
        <View style={ styles.flexRow }>
          <View style={ styles.flexFull } />
          <Button icon={ ICON.ADD } mode="text" onPress={ this.toggleOpen }>
            Add Mailbox
          </Button>
        </View>
        { rows.map(row => (
          <Mailbox
            { ...row }
            key={ row.id }
            onLock={ data => console.log('lock:', data) }
            onUnlock={ data => console.log('unlock:', data) } />
        )) }
      </ScrollView>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchDismiss: v => dispatch(dismiss(v)),
  dispatchGetMailboxes: () => dispatch(getMailboxes()),
})

const mapState = state => ({
  alerts: state.alerts,
  mailboxes: state.mailboxes,
  me: state.me,
})

export default connect(mapState, mapDispatch)(Dashboard)
