/**
 * 速芽物流用户端 - ActivityIndicatorItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    StyleSheet,
    ActivityIndicator
} from 'react-native'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

export default class ActivityIndicatorItem extends Component {

    render(){
        const { color } = this.props;
        return (
            <ActivityIndicator size="large" color={color ? color : GlobalStyles.themeColor} style={styles.activityIndicator} />
        );
    }
}

const styles = StyleSheet.create({    
    activityIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});