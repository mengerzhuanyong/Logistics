/**
 * 速芽物流用户端 - CooperateDetail
 * http://menger.me
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
import SpinnerLoading from '../../component/common/SpinnerLoading'

const WEBVIEW_REF = 'webview';

export default class CooperateDetail extends Component {

    constructor(props){
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            url: params && params.webUrl ? params.webUrl : '',
            canBack: false,
            loading: true,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        // this.loadNetData();
        this.backTimer = setTimeout(() => {
            this.setState({
                loading: false,
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
        let url = NetApi.cooperate;
        this.netRequest.fetchGet(url)
            .then( result => {
                this.updateState({
                    url: result.data.link
                })
                // consoleLog('登录', result);
            })
            .catch( error => {
                // consoleLog('登录出错', error);
            })
    };

    onNavigationStateChange = () => {
        alert(123);
    };


    render() {
        let {loading} = this.state;
        let {params} = this.props.navigation.state;
        let pageTitle = params && params.pageTitle ? params.pageTitle : '我要合作';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {pageTitle}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {!loading ?
                    <WebView
                        ref={(webView) => {this.webview = webView}}
                        startInLoadingState={false}
                        source={{uri: this.state.url}}
                        style={styles.webContainer}
                        // onNavigationStateChange={this.onNavigationStateChange}
                    />
                    : <SpinnerLoading isVisible={loading}/>
                }
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