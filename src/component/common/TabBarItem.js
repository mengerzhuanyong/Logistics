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

    componentDidMount(){
        // this.loadNetData();
        this.listener = DeviceEventEmitter.addListener('ACTION_NAVGATION',
            (action, params) => this.onAction(action, params));
    }

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onAction(action, params) {
        if (ACTION_NAVGATION.A_RESTART === action) {
            // this.loadNetData();
        }
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    renderOrderNum = (num) => {
        num = parseInt(num);
        let result = '';
        if (num > 99) {
            result = <Text style={GlobalStyles.subScript} numberOfLines={1}>99+</Text>
            return result;
        }
        result = <Text style={[GlobalStyles.subScript, GlobalStyles.subScriptLarge,]} numberOfLines={1}>{num}</Text>
        return result;
    }

    loadNetData = () => {
        let url = NetApi.flowOrderNum;
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code == 1) {
                    // // console.log(result);
                    this.setState({
                        orderNum: result.sum
                    })
                }
            })
            .catch( error => {
                // console.log('导航角标', error);
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source = {this.props.focused ? this.props.selectedImage : this.props.normalImage} style = {styles.tabBarIcon} />  
                {this.props.subScript && this.state.orderNum > 0 ? this.renderOrderNum(this.state.orderNum) : null}
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