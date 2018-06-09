/**
 * 速芽物流用户端 - SendSMS
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

export default class SendSMS extends Component {

    render(){
        const { title, sendSMS } = this.props;

        return (
            <TouchableOpacity
                style = {GlobalStyles.btnGetCodeView}
                onPress = {sendSMS}
            >
                <Text style={GlobalStyles.btnGetCodeItem}>{title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    
});