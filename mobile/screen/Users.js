
import { connect } from 'react-redux'
import { deleteUser, getDetails, postUser } from '../core/Actions'
import { ICON } from '../core/Constants'
import React from 'react'
import Styles, { COLOR } from '../core/Styles'

import { Button } from 'react-native-elements'
import Component from '../core/Component'
import Form, { TYPE } from '../component/Form'
import Icon from '../component/Icon'
import Modal from '../component/Modal'
import { RefreshControl, ScrollView, View } from 'react-native'
import Screen from '../component/Screen'
import UserList from '../component/UserList'

class Users extends Component {
  handleUserDelete = async v => {
    const confirmed = await this.confirm()
    if (confirmed) this.props.dispatchDelete(v).then(this.handleClose)
  }

  handleUserPost = v => {
    const d = { ...v, accountId: this.props.user.accountId }
    this.props.dispatchPostUser(d).then(this.handleClose)
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
            title="Add User"
            visible={ this.state.showForm }>
            <View style={[Styles.centered, Styles.modal]}>
              <View style={ Styles.modalContent }>
                <Form
                  fields={[TYPE.NAME, TYPE.EMAIL, TYPE.PHONE]}
                  onSubmit={ this.handleUserPost }
                  title="By adding a user to the account you will share administrative privileges with them.  This user will be able to remove you from the account." />
              </View>
            </View>
          </Modal>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}></View>
            <Button
              buttonStyle={{ marginRight: 20 }}
              icon={ (<Icon color={ COLOR.BLACK } name={ ICON.ADD } />)}
              onPress={ () => this.setState({ data: {}, showForm: true }) }
              title="Add User"
              titleStyle={{ color: COLOR.BLACK }}
              type="clear" />
          </View>
          <UserList
            items={ this.props.users.filter(user => user.id !== this.props.user.id) }
            onDelete={ this.handleUserDelete } />
        </ScrollView>
      </Screen>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchDelete: v => dispatch(deleteUser(v)),
  dispatchGetDetails: () => dispatch(getDetails()),
  dispatchPostUser: v => dispatch(postUser(v)),
})

const mapProps = state => ({
  data: state.data,
  user: state.user,
  users: state.users,
})

export default connect(mapProps, mapDispatch)(Users)
