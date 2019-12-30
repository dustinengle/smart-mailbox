
import React from 'react'

import { Icon } from 'react-native-elements'

const CoreIcon = props => (
  <Icon { ...props } type="material-community" />
)

export const getIcon = name => {
  return ({ focused, tintColor }) => {
    return (
      <CoreIcon
        color={ tintColor }
        name={ `${ name }${ focused ? '' : '-outline' }` }
        size={ 24 } />
    )
  }
}

export default CoreIcon
