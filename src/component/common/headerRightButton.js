/**
 * 速芽物流用户端 - MINE
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

export default class RightButton extends Component {

    _submitChange = () => {

    }
    render(){
        return (
            <TouchableOpacity
                style = {styles.headerRightButton}
                onPress = { () => this._submitChange()}
            >
                <Text>保存</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 10,
    },
})