
import Component from '../core/Component'
import { connect } from 'react-redux'
import { ICON } from '../core/Constants'
import React from 'react'
import { styles } from '../core/Style'

import { Card } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScrollView, Text, View } from 'react-native'

class Wallet extends Component {
  render() {
    return (
      <ScrollView style={ styles.content }>
        <View style={[styles.flexColumn]}>
          <View style={[styles.center, styles.flexColumn, styles.margins]}>
            <Text style={{ fontSize: 30 }}>
            <Icon name={ ICON.WALLET } size={ 30 } /> StreamIOT Balance
            </Text>
            <Text style={{ fontSize: 32 }}>
              { (Math.random() * 1000.0).toFixed(8) }
            </Text>
          </View>
          { this.props.mailboxes.map(mailbox => (
            <View
              key={ mailbox.id }
              style={[styles.center, styles.flexColumn, styles.margins]}>
              <Text style={{ fontSize: 22 }}>
                <Icon name={ ICON.MAILBOX } size={ 22 } /> { mailbox.name }
              </Text>
              <Text style={{ fontSize: 24 }}>
                { (Math.random() * 1000.0).toFixed(8) }
              </Text>
            </View>
          )) }
        </View>
      </ScrollView>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({
  mailboxes: state.mailboxes,
})

export default connect(mapState, mapDispatch)(Wallet)
