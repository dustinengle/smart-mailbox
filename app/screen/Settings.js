
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import { Button, Subheading } from 'react-native-paper'
import { View } from 'react-native'

class Settings extends Component {
  render() {
    return (
      <View style={ styles.content }>
        <Subheading>Settings</Subheading>
        <Button
          mode="outlined"
          onPress={ () => this.props.navigation.navigate('Login') }
          style={ styles.button }>
          Logout
        </Button>
      </View>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({

})

export default connect(mapState, mapDispatch)(Settings)
