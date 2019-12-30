
import { connect } from 'react-redux'
import { getUserLogout, putUser } from '../core/Actions'
import React from 'react'
import Styles from '../core/Styles'

import { Button } from 'react-native-elements'
import Card from '../component/Card'
import Component from '../core/Component'
import Form, { TYPE } from '../component/Form'
import Screen from '../component/Screen'
import { View } from 'react-native'

class Profile extends Component {
  handleLogout = () => this.props.dispatchPostLogout().then(() => {
    this.props.navigation.navigate('Login')
  })

  handleUserPost = v => this.props.dispatchPutUser(v)

  render() {
    return (
      <Screen>
        <View style={[Styles.container]}>
          <Card>
            <Form
              data={ this.props.user }
              fields={[TYPE.NAME, TYPE.EMAIL, TYPE.PHONE]}
              onSubmit={ this.handleSubmit } />
          </Card>
          <Card>
            <Button
              onPress={ this.handleLogout }
              title="Logout"
              type="outline" />
          </Card>
        </View>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostLogout: () => dispatch(getUserLogout()),
  dispatchPutUser: v => dispatch(putUser(v)),
})

const mapProps = state => ({
  user: state.user,
})

export default connect(mapProps, mapDispatch)(Profile)
