
import { isWeb } from '../../core/Device'
import React, { useEffect, useState } from 'react'
import { styles } from '../../core/Style'

import { TextInput } from 'react-native-paper'

const valid = v => {
  if (!v) return false
  if (v.length <= 3) return false
  return true
}

const Password = props => {
  const [changed, setChanged] = useState(false)
  const [value, setValue] = useState(props.value || '')

  useEffect(() => {
    if (!!props.value && props.value !== value) {
      setValue(props.value)
    }
  })

  const mobileFields = isWeb() ? {} : {
    autoCapitalize: 'none',
    autoCompleteType: 'password',
    autoFocus: false,
  }

  return (
    <TextInput
      { ...mobileFields }
      error={ changed && !valid(value) }
      label="Password"
      onChangeText={ text => {
        setChanged(true)
        setValue(text)
        if (props.onChange) props.onChange(valid(value) ? value : '')
      }}
      style={ styles.input }
      value={ value } />
  )
}

export default Password
