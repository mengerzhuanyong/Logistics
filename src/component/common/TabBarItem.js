/**
 * 速芽物流用户端 - TABBARITEM
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import { ACTION_NAVGATION } from '../../constant/EventActions'
import { toastShort, consoleLog } from '../../util/utilsToast'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'


export default class TabBarItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            orderNum: '',
        }
        this.netRequest = new NetRequest();
    }

    render() {
        let {focused, selectedImage, normalImage} = this.props;
        return (
            <View style={styles.container}>
                <Image
                    source = {focused ? selectedImage : normalImage}
                    style = {[styles.tabBarIcon, focused && {tintColor: GlobalStyles.themeColor}]}
                />  
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: 20,
        height: 20,
        position: 'relative',
    },
    tabBarIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
})