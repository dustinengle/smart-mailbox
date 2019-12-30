
import { connect } from 'react-redux'
import { deleteGateway, deleteMailbox, getDetails, postGateway, postMailbox } from '../core/Actions'
import { ICON } from '../core/Constants'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button } from 'react-native-elements'
import Component from '../core/Component'
import Form, { TYPE } from '../component/Form'
import GatewayList from '../component/GatewayList'
import Icon from '../component/Icon'
import Modal from '../component/Modal'
import ModalList from '../component/ModalList'
import { RefreshControl, ScrollView, View } from 'react-native'
import Screen from '../component/Screen'

class Gateways extends Component {
  handleGatewayDelete = async v => {
    const confirmed = await this.confirm()
    if (confirmed) this.props.dispatchDeleteGateway(v).then(this.handleClose)
  }

  handleGatewayPost = v => {
    this.props.dispatchPostGateway(v).then(this.handleClose)
  }

  handleMailboxDelete = async v => {
    const confirmed = await this.confirm()
    if (confirmed) this.props.dispatchDeleteMailbox(v).then(this.handleClose)
  }

  handleMailboxPost = v => {
    v.gatewayId = this.state.data.id
    this.props.dispatchPostMailbox(v).then(this.handleClose)
  }

  render() {
    if (this.state.isLoading) {
      return this.renderLoading()
    }

    return (
      <Screen>
        <ScrollView
          refreshControl={(
            <RefreshControl refreshing={ this.state.isLoading } onRefresh={ this.refreshData } />
          )}
          style={ Styles.container }>
          <Modal
            onClose={ this.handleClose }
            title="Add Gateway"
            visible={ this.state.showForm === 'gateway' }>
            <View style={[Styles.centered, Styles.modal]}>
              <View style={ Styles.modalContent }>
                <Form
                  fields={[TYPE.NAME, TYPE.PUBLIC_KEY, TYPE.SCANNER]}
                  onSubmit={ this.handleGatewayPost }
                  title="Add a gateway control unit to the account by scanning the QR code on the display." />
              </View>
            </View>
          </Modal>
          <Modal
            onClose={ this.handleClose }
            title="Add Mailbox"
            visible={ this.state.showForm === 'mailbox' }>
            <View style={[Styles.centered, Styles.modal]}>
              <View style={ Styles.modalContent }>
                <Form
                  fields={[TYPE.NAME, TYPE.PUBLIC_KEY, TYPE.SCANNER]}
                  onSubmit={ this.handleMailboxPost }
                  title="Add a mailbox to a gateway by scanning the QR code on the display." />
              </View>
            </View>
          </Modal>
          <ModalList
            keys={['name']}
            items={ this.state.data.mailboxes || [] }
            onClose={ this.handleClose }
            onDelete={ this.handleMailboxDelete }
            title="Mailboxes"
            visible={ this.state.showList } />
          <View style={ Styles.flexRow }>
            <View style={{ flex: 1 }}></View>
            <Button
              buttonStyle={{ marginRight: 20 }}
              icon={ (<Icon color={ COLOR.BLACK } name={ ICON.ADD } />) }
              onPress={ () => this.setState({ data: {}, showForm: 'gateway' }) }
              title="Add Gateway"
              titleStyle={{ color: COLOR.BLACK }}
              type="clear" />
          </View>
          <GatewayList
            items={ this.props.gateways.map(gw => ({
              ...gw,
              mailboxes: this.props.mailboxes.filter(mb => mb.gatewayId === gw.id),
            })) }
            onDelete={ this.handleGatewayDelete }
            onMailbox={ data => this.setState({ data, showForm: 'mailbox' }) }
            onMailboxes={ data => this.setState({ data, showList: true }) } />
        </ScrollView>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchDeleteGateway: v => dispatch(deleteGateway(v)),
  dispatchDeleteMailbox: v => dispatch(deleteMailbox(v)),
  dispatchGetDetails: () => dispatch(getDetails()),
  dispatchPostGateway: v => dispatch(postGateway(v)),
  dispatchPostMailbox: v => dispatch(postMailbox(v)),
})

const mapProps = state => ({
  data: state.data,
  gateways: state.gateways,
  mailboxes: state.mailboxes,
})

export default connect(mapProps, mapDispatch)(Gateways)
