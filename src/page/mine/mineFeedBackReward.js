/**
 * 速芽物流用户端 - MineFeedbackReward
 * https://menger.me
 * @Meng
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    WebView,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'

const WEBVIEW_REF = 'webview';

export default class MineFeedbackReward extends Component {

    constructor(props){
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            url: params && params.webUrl ? params.webUrl : '',
            canBack: false,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
    }

    onBack = () => {
        this.props.navigation.goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = () => {
        let url = NetApi.mineFeedbackReward;
        this.netRequest.fetchGet(url)
            .then( result => {
                this.updateState({
                    url: result.data.link
                })
                consoleLog('登录', result);
            })
            .catch( error => {
                // consoleLog('登录出错', error);
            })
    };

    onNavigationStateChange = () => {
        alert(123);
    };


    render() {
        let {params} = this.props.navigation.state;
        let webTitle = params && params.webTitle ? params.webTitle : '有奖反馈';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {webTitle}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <WebView
                    ref={(webView) => {this.webview = webView}}
                    startInLoadingState={true}
                    source={{uri: this.state.url}}
                    style={styles.webContainer}
                    // onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f2f3',
    },
    webContainer: {
        flex: 1,
        // marginTop: -20,
        backgroundColor: '#f1f2f3',
    },
});