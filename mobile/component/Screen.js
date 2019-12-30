
import React from 'react'
import Style, { COLOR } from '../core/Styles'

import { SafeAreaView } from 'react-native'

export default class Screen extends React.PureComponent {
  render() {
    const { children, ...props } = this.props

    return (
      <SafeAreaView style={[Style.container, Style.background]} { ...props }>
        { children }
      </SafeAreaView>
    )
  }
}
