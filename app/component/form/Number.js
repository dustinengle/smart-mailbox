
import { isWeb } from '../../core/Device'
import React, { useEffect, useState } from 'react'
import { styles } from '../../core/Style'

import { TextInput } from 'react-native-paper'

const valid = v => {
  if (!v) return false
  if (v.length !== 4) return false
  return true
}

const Number = props => {
  const [changed, setChanged] = useState(false)
  const [value, setValue] = useState(props.value || '')

  const mobileFields = isWeb() ? {} : {
    autoCapitalize: 'none',
    autoCompleteType: 'off',
    autoFocus: false,
  }

  return (
    <TextInput
      { ...mobileFields }
      error={ changed && !valid(value) }
      label={ props.label || 'Number' }
      onChangeText={ text => {
        setChanged(true)
        setValue(text)
        if (props.onChange) props.onChange(text)
      }}
      style={ styles.input }
      value={ value } />
  )
}

export default Number
