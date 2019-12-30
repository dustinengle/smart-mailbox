
import React from 'react'
import Styles from '../core/Styles'
import { withNavigation } from 'react-navigation'

import { Button, Divider, Input, Text } from 'react-native-elements'
import Modal from './Modal'
import Scanner from './Scanner'
import { View } from 'react-native'

export const TYPE = {
  CONFIRM: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    keyboardType: 'default',
    label: 'Confirm Password',
    match: 'password',
    name: 'confirm',
    required: true,
    returnKeyType: 'next',
    textContentType: 'password',
  },
  DIVIDER: {},
  EMAIL: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    email: true,
    keyboardType: 'email-address',
    label: 'Email Address',
    name: 'email',
    returnKeyType: 'next',
    textContentType: 'emailAddress',
  },
  NAME: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    keyboardType: 'default',
    label: 'Name',
    max: 100,
    min: 1,
    name: 'name',
    required: true,
    returnKeyType: 'next',
    textContentType: 'name',
  },
  PASSWORD: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    keyboardType: 'default',
    label: 'Password',
    name: 'password',
    password: true,
    required: true,
    returnKeyType: 'next',
    textContentType: 'password',
  },
  PHONE: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    keyboardType: 'phone-pad',
    label: 'Phone Number',
    name: 'phone',
    phone: true,
    returnKeyType: 'next',
    textContentType: 'telephoneNumber',
  },
  PIN: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    keyboardType: 'number-pad',
    label: 'PIN',
    name: 'pin',
    pin: true,
    required: true,
    returnKeyType: 'next',
    textContentType: 'oneTimeCode',
  },
  PUBLIC_KEY: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    keyboardType: 'default',
    label: 'QR Code',
    max: 64,
    min: 32,
    name: 'publicKey',
    required: true,
    returnKeyType: 'next',
    textContentType: 'none',
  },
  SCANNER: {
    autoCompleteType: 'off',
    clearButtonMode: 'while-editing',
    keyboardType: 'default',
    label: 'Scan QR Code',
    name: 'publicKey',
    returnKeyType: 'next',
    textContentType: 'none',
  },
}

// The fields that should be masked.
const lowerFields = new Set(['email'])
const maskFields = new Set(['confirm', 'password'])

class Form extends React.PureComponent {
  static defaultProps = {
    fields: [],
  }

  static getDerivedStateFromProps(props, state) {
    if (!Object.keys(state.data).length && !!props.data) {
      props.fields.forEach(field => {
        state.data[field.name] = props.data[field.name]
      })
      return state
    }
    return null
  }

  state = {
    data: {},
    errors: {},
    showScanner: false,
  }

  handleChange = (k, v) => {
    console.log('handleChange:', k, v)
    if (k === TYPE.PUBLIC_KEY.name && !v) return

    // Trim the value if its a string.
    if (typeof(v) === 'string') v = v.trim()

    // Convert some fields to lowercase.
    if (lowerFields.has(k)) v = String(v).toLowerCase()

    const state = {
      ...this.state,
      data: {
        ...this.state.data,
        [k]: v,
      },
      showScanner: false,
    }

    this.setState(state, this._validate)
  }

  handleReset = () => this.setState({ data: {}, errors: {} })

  handleScan = v => this.handleChange('publicKey', v)

  handleSubmit = () => {
    this._validate(() => {
      if (Object.keys(this.state.errors).length === 0) {
        this.props.onSubmit(this.state.data)
      }
    })
  }

  _validate = callback => {
    const errors = {}

    this.props.fields.forEach(field => {
      const v = this.state.data[field.name]
      let err = ''

      if (field.required && !v) {
        err = 'is required'
      }

      if (!err && field.email && !v) {
        err = 'must be a valid email address'
      }

      if (!err && field.match && v !== this.state.data[field.match]) {
        err = 'does not match password'
      }

      if (!err && field.max) {
        if (typeof(v) === 'string' && v.length > field.max) {
          err = `cannot be longer than ${ field.max } characters`
        } else if (v > field.max) {
          err = `cannot be greater than ${ field.max }`
        }
      }

      if (!err && field.min) {
        if (typeof(v) === 'string' && v.length < field.min) {
          err = `cannot be shorter than ${ field.min } characters`
        } else if (v < field.min) {
          err = `cannot be less than ${ field.min }`
        }
      }

      if (!err && field.password && !v) {
        err = 'must be provided'
      }

      if (!err && field.pin && (v.length !== 4 || isNaN(v))) {
        err = 'number must be 4 digits from 0-9'
      }

      if (!!err) errors[field.name] = `${ field.label } ${ err }`
    })

    this.setState({ errors }, callback)
  }

  render() {
    const hasData = Object.keys(this.state.data).length !== 0
    const hasErrors = Object.keys(this.state.errors).length > 0

    return (
      <View style={ Styles.form }>
        <Modal
          onClose={ () => this.setState({ showScanner: false }) }
          title="Scan QR"
          visible={ this.state.showScanner }>
          <Scanner onScan={ this.handleScan } />
        </Modal>
        <Text style={ Styles.formTitle }>{ this.props.title }</Text>
        { this.props.fields.map(field => {
          // Display a divider.
          if (field === TYPE.DIVIDER) {
            return (<Divider />)
          }

          // Display the scanner button.
          if (field === TYPE.SCANNER) {
            return (
              <Button
                key="scanner"
                onPress={ () => this.setState({ showScanner: true }) }
                title={ field.label }
                type="clear" />
            )
          }

          return (
            <Input
              autoCapitalize="none"
              autoCorrect={ false }
              autoCompleteType={ field.autoCompleteType }
              clearButtonMode={ field.clearButtonMode }
              errorMessage={ this.state.errors[field.name] ? this.state.errors[field.name] : null }
              errorStyle={ Styles.error }
              inputContainerStyle={ Styles.input }
              key={ field.name }
              keyboardType={ field.keyboardType }
              maxLength={ field.max }
              name={ field.name }
              onChangeText={ v => this.handleChange(field.name, v) }
              placeholder={ field.label }
              returnKeyType={ field.returnKeyType }
              secureTextEntry={ maskFields.has(field.name) }
              spellCheck={ false }
              textContentType={ field.textContentType }
              value={ this.state.data[field.name] } />
          )
        }) }
        <Button
          buttonStyle={ Styles.button }
          disabled={ !hasData || hasErrors }
          onPress={ this.handleSubmit }
          title="Submit"
          type={ (!hasData || hasErrors) ? 'clear' : 'solid' } />
        <Button
          buttonStyle={ Styles.button }
          disabled={ !hasData }
          onPress={ this.handleReset }
          title="Reset"
          type="outline" />
      </View>
    )
  }
}

export default withNavigation(Form)
