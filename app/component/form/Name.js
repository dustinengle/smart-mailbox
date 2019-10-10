
import { isWeb } from '../../core/Device'
import React, { useEffect, useState } from 'react'
import { styles } from '../../core/Style'

import { TextInput } from 'react-native-paper'

const valid = v => {
  if (!v) return false
  if (v.length <= 3) return false
  return true
}

const Name = props => {
  const [changed, setChanged] = useState(false)
  const [value, setValue] = useState(props.value || '')

  const mobileFields = isWeb() ? {} : {
    autoCapitalize: 'words',
    autoCompleteType: 'name',
    autoFocus: false,
  }

  return (
    <TextInput
      { ...mobileFields }
      error={ changed && !valid(value) }
      label={ props.label || 'Name' }
      onChangeText={ text => {
        setChanged(true)
        setValue(text)
        if (props.onChange) props.onChange(text)
      }}
      style={ styles.input }
      value={ value } />
  )
}

export default Name
