
import Component from '../core/Component'
import React from 'react'
import { styles } from '../core/Style'

import { Image } from 'react-native'

export default class Logo extends Component {
  static defaultProps = {
    path: require('../assets/mailbox.png'),
  }

  render() {
    return (
      <Image source={ this.props.path } style={ styles.logo } />
    )
  }
}
