
import { connect } from 'react-redux'
import { deletePIN, getDetails, postPIN } from '../core/Actions'
import React from 'react'
import Styles from '../core/Styles'

import Component from '../core/Component'
import Form, { TYPE } from '../component/Form'
import MailboxList from '../component/MailboxList'
import Modal from '../component/Modal'
import ModalList from '../component/ModalList'
import { RefreshControl, ScrollView, View } from 'react-native'
import Screen from '../component/Screen'

class Mailboxes extends Component {
  handlePINDelete = async v => {
    const confirmed = await this.confirm()
    if (confirmed) this.props.dispatchDeletePIN(v).then(this.handleClose)
  }

  handlePINPost = v => {
    const data = {
      mailboxId: this.state.data.id,
      name: v.name,
      number: parseInt(v.pin, 10),
    }
    this.props.dispatchPostPIN(data).then(this.handleClose)
  }

  render() {
    if (this.state.isLoading) {
      return this.renderLoading()
    }

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
            onClose={ this.handleClose }
            title="Add PIN"
            visible={ this.state.showForm }>
            <View style={[Styles.centered, Styles.modal]}>
              <View style={ Styles.modalContent }>
                <Form
                  fields={[TYPE.NAME, TYPE.PIN]}
                  onSubmit={ this.handlePINPost }
                  title="Provide a name and number to allow keypad access to the mailbox." />
              </View>
            </View>
          </Modal>
          <ModalList
            keys={['name', 'number']}
            items={ this.state.data.pins || [] }
            onClose={ this.handleClose }
            onDelete={ this.handlePINDelete }
            title="PINs"
            visible={ this.state.showList } />
          <MailboxList
            items={ this.props.mailboxes.map(mb => ({
              ...mb,
              gateway: this.props.gateways.find(gw => gw.id === mb.gatewayId),
              pins: this.props.pins.filter(pin => pin.mailboxId === mb.id),
            })) }
            onPIN={ data => this.setState({ data, showForm: true }) }
            onPINs={ data => this.setState({ data, showList: true }) } />
        </ScrollView>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchDeletePIN: v => dispatch(deletePIN(v)),
  dispatchGetDetails: () => dispatch(getDetails()),
  dispatchPostPIN: v => dispatch(postPIN(v)),
})

const mapProps = state => ({
  data: state.data,
  gateways: state.gateways,
  mailboxes: state.mailboxes,
  pins: state.pins,
})

export default connect(mapProps, mapDispatch)(Mailboxes)
