
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { styles } from '../core/Style'

import { Subheading } from 'react-native-paper'
import UserList from '../component/list/User'
import { View } from 'react-native'

class User extends Component {
  render() {
    return (
      <View style={ styles.content }>
        <Subheading>User</Subheading>
        <UserList rows={ this.props.user } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({

})

const mapState = state => ({
  users: state.users,
})

export default connect(mapState, mapDispatch)(User)
