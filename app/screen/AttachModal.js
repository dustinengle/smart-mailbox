
import Component from '../core/Component'
import { connect } from 'react-redux'
import { isWeb } from '../core/Device'
import React from 'react'
import { styles } from '../core/Style'

import { Button, Divider, Subheading } from 'react-native-paper'
import NameInput from '../component/form/Name'
import SNInput from '../component/form/SN'
import SubmitButton from '../component/form/Submit'
import { View } from 'react-native'

class AttachModal extends Component {
  static navigationOptions = {
    title: 'Attach Mailbox & Gateway',
  }

  handleSubmit = () => {
    console.log('attach submit:', this.state)
  }

  isValid = () => !!this.state.name && !!this.state.mailboxSN && !!this.state.gatewaySN

  render() {
    return (
      <View style={ styles.content }>
        <Subheading>Mailbox</Subheading>
        <NameInput onChange={ v => this.handleChange('name', v) } value={ this.state.name } />
        <SNInput onChange={ v => this.handleChange('mailboxSN', v) } value={ this.state.mailboxSN } />
        { !isWeb() &&
          <Button
            mode="outlined"
            onPress={ () => this.props.navigation.navigate('BarcodeModal', {
              callback: v => this.handleChange('mailboxSN', v),
            }) }
            style={ styles.button }>
            Scan SN
          </Button>
        }
        <Divider style={{ marginTop: 10 }} />
        <Subheading>Gateway</Subheading>
        <SNInput onChange={ v => this.handleChange('gatewaySN', v) } value={ this.state.gatewaySN } />
        { !isWeb() &&
          <Button
            mode="outlined"
            onPress={ () => this.props.navigation.navigate('BarcodeModal', {
              callback: v => this.handleChange('gatewaySN', v),
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

})

const mapState = state => ({
  mailboxes: state.mailboxes,
})

export default connect(mapState, mapDispatch)(AttachModal)
