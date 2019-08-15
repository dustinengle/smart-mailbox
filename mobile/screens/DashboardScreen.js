
import Colors from '../constants/Colors'
import React from 'react'

import { connect } from 'react-redux'
import { fetchChannels, fetchThings } from '../lib/Actions'

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Toolbar from '../components/Toolbar'

class DashboardScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    await this.props.load()
  }

  render() {
    return (
      <View style={ styles.container }>
        <Toolbar onDrawer={ this.props.navigation.openDrawer } />
        <View style={ styles.actionContainer }>
          <TouchableOpacity onPress={ this._onRefresh }>
            <Text style={ styles.actionText }>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={ styles.contentContainer }>
          <Text>Channels: { this.props.channels.length }</Text>
          <Text>Things: { this.props.things.length }</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    marginTop: 24,
  },
  actionContainer: {
    backgroundColor: Colors.actionBackground,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  actionText: {
    color: Colors.tintColor,
    fontSize: 12,
    height: 28,
    lineHeight: 28,
  },
  contentContainer: {
    flex: 1,
    padding: 30,
  },
})

const mapDispatchToProps = dispatch => ({
  load: async () => {
    return Promise.all([
      fetchChannels()(dispatch),
      fetchThings()(dispatch),
    ])
  },
})

const mapStateToProps = state => ({
  channels: state.channels,
  email: state.email,
  messages: state.messages,
  things: state.things,
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)