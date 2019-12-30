
import { ICON } from '../core/Constants'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button } from 'react-native-elements'
import Component from '../core/Component'
import Empty from './Empty'
import Icon from './Icon'
import { Modal, Text, View } from 'react-native'
import Screen from './Screen'

export default class ModalList extends Component {
  static defaultProps = {
    keys: [],
    items: [],
    onClose: () => {},
    onDelete: data => console.log('TODO: ModalList.onDelete:', data),
    title: 'Unknown',
    visible: false,
  }

  handleClose = () => {
    this.props.onClose()
  }

  handleDelete = data => {
    this.props.onDelete(data)
  }

  render() {
    const rows = []
    this.props.items.forEach(item => {
      rows.push(
        <View key={ item.id } style={[Styles.flexRow, Styles.modalListItem]}>
          { this.props.keys.map(key => (
            <View key={ key } style={[Styles.flexFull]}>
              <Text style={{ fontSize: 20 }}>{ item[key] }</Text>
            </View>
          )) }
          <Button
            icon={ () => (<Icon color={ COLOR.RED } name={ ICON.DELETE } size={ 20 } />) }
            onPress={ () => this.handleDelete(item) }
            type="clear" />
        </View>
      )
    })

    return (
      <Screen>
        <Modal
          animationType="slide"
          transparent={ false }
          visible={ this.props.visible }
          onRequestClose={ this.handleClose }>
          <View style={[Styles.flexRow, Styles.modalListHeader]}>
            <Text style={[Styles.flexFull, Styles.modalListTitle]}>
              { this.props.title }
            </Text>
            <Button
              icon={ (<Icon color={ COLOR.PRIMARY } name={ ICON.CLOSE } />) }
              onPress={ this.handleClose }
              type="clear" />
          </View>
          { !rows.length && <Empty /> }
          { rows }
        </Modal>
      </Screen>
    )
  }
}
