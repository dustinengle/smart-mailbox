
import Component from '../core/Component'
import { connect } from 'react-redux'
import { isWeb } from '../core/Device'
import { postMailbox } from '../core/Actions'
import React from 'react'
import { styles, theme } from '../core/Style'

import { Button, Divider, Subheading } from 'react-native-paper'
import NameInput from '../component/form/Name'
import SNInput from '../component/form/SN'
import SubmitButton from '../component/form/Submit'
import { View } from 'react-native'

class AttachModal extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: theme.colors.accent,
    },
    headerTintColor: theme.colors.white,
    title: 'Attach Mailbox & Gateway',
  }

  handleSubmit = () => {
    const data = {
      accountId: this.props.me.accountId,
      gateway: this.state.gateway,
      key: Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6),
      name: this.state.name,
      sn: this.state.sn,
    }
    console.log('attach submit:', data)
    this.props.dispatchPostMailbox(data)
      .then(() => this.props.navigation.goBack())
  }

  isValid = () => !!this.state.name && !!this.state.sn && !!this.state.gateway

  render() {
    return (
      <View style={ styles.content }>
        <Subheading>Mailbox</Subheading>
        <NameInput onChange={ v => this.handleChange('name', v) } value={ this.state.name } />
        <SNInput onChange={ v => this.handleChange('sn', v) } value={ this.state.sn } />
        { !isWeb() &&
          <Button
            mode="outlined"
            onPress={ () => this.props.navigation.navigate('BarcodeModal', {
              callback: v => this.handleChange('sn', v),
            }) }
            style={ styles.button }>
            Scan SN
          </Button>
        }
        <Divider style={{ marginTop: 10 }} />
        <Subheading>Gateway</Subheading>
        <SNInput onChange={ v => this.handleChange('gateway', v) } value={ this.state.gateway } />
        { !isWeb() &&
          <Button
            mode="outlined"
            onPress={ () => this.props.navigation.navigate('BarcodeModal', {
              callback: v => this.handleChange('gateway', v),
            }) }
            style={ styles.button }>
            Scan SN
          </Button>
        }
        <Divider style={{ marginTop: 10 }} />
        <SubmitButton disabled={ !this.isValid() } onSubmit={ this.handleSubmit } />
      </View>
    )
  }
}

const mapDispatch = dispatch => ({
  dispatchPostMailbox: v => dispatch(postMailbox(v)),
})

const mapState = state => ({
  mailboxes: state.mailboxes,
  me: state.me,
})

export default connect(mapState, mapDispatch)(AttachModal)
