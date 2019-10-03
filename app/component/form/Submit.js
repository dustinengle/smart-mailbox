
import React from 'react'
import { styles } from '../../core/Style'

import { Button } from 'react-native-paper'

const Submit = props => (
  <Button
    disabled={ props.disabled }
    mode="outlined"
    onPress={ props.onSubmit }
    style={ styles.button }>
    Submit
  </Button>
)

export default Submit
