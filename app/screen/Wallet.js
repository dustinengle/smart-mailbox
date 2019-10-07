
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
        <View style={ styles.flexColumn }>
          <Card>
            <Card.Title
              left={ () => (<Icon name={ ICON.WALLET } size={ 20 } />) }
              title="Account Balance" />
            <Card.Content>
              <Text style={[styles.textCenter, styles.textHuge]}>
              { (Math.random() * 10000.0).toFixed(8) }
              </Text>
            </Card.Content>
          </Card>
          { this.props.mailboxes.map(mailbox => (
            <Card key={ mailbox.id } style={ styles.margins }>
              <Card.Title
                left={ () => (<Icon name={ ICON.MAILBOX } size={ 20 } />) }
                title={ mailbox.name } />
              <Card.Content>
                <Text style={[styles.textCenter, styles.textHuge]}>
                  { (Math.random() * 1000.0).toFixed(8) }
                </Text>
              </Card.Content>
            </Card>
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
