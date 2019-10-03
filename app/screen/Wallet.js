
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import { Subheading } from 'react-native-paper'
import { View } from 'react-native'

class Wallet extends Component {
  render() {
    return (
      <View style={ styles.content }>
        <Subheading>Wallet</Subheading>
      </View>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({

})

export default connect(mapState, mapDispatch)(Wallet)
