
import Component from '../core/Component'
import { connect } from 'react-redux'
import React from 'react'
import { putMailbox } from '../core/Actions'
import { styles } from '../core/Style'

import NameInput from '../component/form/Name'
import SubmitButton from '../component/form/Submit'
import { View } from 'react-native'

class RenameModal extends Component {
  static getDerivedStateFromProps(props, state) {
    const data = props.navigation.getParam('data', null)
    if (!!data && !!data.name && !state.name) {
      state.name = data.name
      return state
    }
    return null
  }

  static navigationOptions = {
    title: 'Rename',
  }

  componentDidMount() {
    const data = this.props.navigation.getParam('data', null)
    if (!!data && !!data.name && !this.state.name) {
      this.setState({ name: data.name })
    }
  }

  handleSubmit = () => {
    const data = this.props.navigation.getParam('data', null)
    if (!data) return
    data.name = this.state.name
    this.props.dispatchPutMailbox(data)
      .then(() => this.props.navigation.goBack())
  }

  isValid = () => !!this.state.name

  render() {
    return (
      <View key={ this.state.id || 0 } style={ styles.content }>
        <NameInput onChange={ v => this.handleChange('name', v) } value={ this.state.name } />
        <SubmitButton disabled={ !this.isValid() } onSubmit={ this.handleSubmit } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPutMailbox: v => dispatch(putMailbox(v)),
})

const mapState = state => ({

})

export default connect(mapState, mapDispatch)(RenameModal)
