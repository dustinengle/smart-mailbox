
import { isWeb } from '../../core/Device'
import React, { useState } from 'react'
import { styles } from '../../core/Style'

import { TextInput } from 'react-native-paper'

const valid = v => {
  if (!v) return false
  if (v.indexOf('@') === -1) return false
  return true
}

const Phone = props => {
  const [changed, setChanged] = useState(false)
  const [value, setValue] = useState(props.value || '')

  const mobileFields = isWeb() ? {} : {
    autoCapitalize: 'none',
    autoCompleteType: 'tel',
    autoFocus: false,
  }

  return (
    <TextInput
      { ...mobileFields }
      error={ changed && !valid(value) }
      label="Phone Address"
      onChangeText={ text => {
        setChanged(true)
        setValue(text)
        if (props.onChange) props.onChange(valid(value) ? value : '')
      }}
      style={ styles.input }
      value={ value } />
  )
}

export default Phone
