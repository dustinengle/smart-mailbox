
import Style, { COLOR } from '../core/Styles'
import React from 'react'

import { TouchableHighlight } from 'react-native'

const Button = ({ children, ...props }) => {
  return (
    <TouchableHighlight style={ Style.button } { ...props }>
      { children }
    </TouchableHighlight>
  )
}

Button.defaultProps = {

}

export default Button
