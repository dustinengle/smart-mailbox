
import Colors from '../constants/Colors'
import React from 'react'

import { 
    Platform,
    StyleSheet,
    Text, 
    TouchableOpacity,
    View 
} from 'react-native'

export default class Toolbar extends React.Component {
    static navigationOptions = {
        header: null,
    }

    _onSelect = () => this.props.onDrawer()

    render() {
        return (
            <View style={ styles.container }>
                <TouchableOpacity onPress={ this._onSelect }>
                    <Text style={ styles.menu }>Menu</Text>
                </TouchableOpacity>
                <View style={ styles.spacer } />
                <Text style={ styles.logo }>Smart Mailbox</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.toolbarBackground,
        flexDirection: 'row',
        height: 32,
    },
    logo: {
        color: Colors.tintColor,
        fontSize: 18,
        lineHeight: 32,
        paddingRight: 10,
    },
    menu: {
        fontSize: 12,
        lineHeight: 32,
        paddingLeft: 10,
        textTransform: 'uppercase',
    },  
    spacer: {
        flex: 1,
    },
})
