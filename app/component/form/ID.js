
import { isWeb } from '../../core/Device'
import React, { useState } from 'react'
import { styles } from '../../core/Style'

import { TextInput } from 'react-native-paper'

const valid = v => {
  if (!v) return false
  if (v.length <= 3) return false
  return true
}

const ID = props => {
  const [changed, setChanged] = useState(false)
  const [value, setValue] = useState(props.value || '')

  const mobileFields = isWeb() ? {} : {
    autoCapitalize: 'off',
    autoCompleteType: 'none',
    autoFocus: false,
  }

  return (
    <TextInput
      { ...mobileFields }
      error={ changed && !valid(value) }
      label="ID"
      onChangeText={ text => {
        setChanged(true)
        setValue(text)
        if (props.onChange) props.onChange(valid(value) ? value : '')
      }}
      style={ styles.input }
      value={ value } />
  )
}

export default ID
