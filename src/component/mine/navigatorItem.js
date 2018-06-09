/**
 * 速芽物流用户端 - navigationItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import { toastShort, consoleLog } from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

export default class navigationItem extends Component {

    constructor(props){
        super(props);
        this.state = {};
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        // console.log("接受参数", this.props);
    }

    updateState = (state) => {
        if (!this) { return };
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    render(){
        const { onPushNavigator, leftIcon, leftTitle, rightText } = this.props;
        // console.log(rightText);
        return (
            <TouchableOpacity
                style = {styles.container}
                onPress = {onPushNavigator}
            >
                <View style={styles.navigationViewItem}>
                    {leftIcon && <Image source={leftIcon} style={styles.navigationIcon} />}
                    <Text style={styles.navigationName}>{leftTitle}</Text>
                </View>
                <View style={styles.navigationViewItem}>
                    {rightText != '' && rightText != '0' ? <Text style={styles.navigationRightText}>{rightText}</Text> : null}
                    <Image source={GlobalIcons.icon_angle_right_black} style={styles.navigationRightIcon} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    navigationItemView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (GlobalStyles.width - 30) / 4,
    },
    navigationViewItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navigationIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        resizeMode: 'contain',
    },
    navigationName: {
        color: '#333',
        fontSize: 15,
    },
    navigationRightText: {
        marginRight: 10,
        color: GlobalStyles.themeColor,
    },
    navigationRightIcon: {
        width: 15,
        height: 15,
        tintColor: '#888',
        resizeMode: 'contain',
    }
});