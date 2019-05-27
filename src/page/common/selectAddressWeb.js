/**
 * 速芽物流用户端 - SelectAddressWeb
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
    StatusBar,
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

const patchPostMessageFunction = () => {
    const originalPostMessage = window.postMessage;
    const patchedPostMessage = (message, targetOrigin, transfer) => {
        originalPostMessage(message, targetOrigin, transfer);
    };
    patchedPostMessage.toString = () => String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = `(${String(patchPostMessageFunction)})();`;

export default class SelectAddressWeb extends Component {

    constructor(props){
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            url: 'http://suya.3todo.com/user/amap',
            canBack: false,
            loading: true,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        // console.log(this.state.url);
        this.loadNetData();
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
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = () => {
    };

    onMessage = (event) => {
        let address = '';
        let longitude = '';
        let addressName = '';
        console.log('event.nativeEvent.data---->', event.nativeEvent.data);
        let {data} = event.nativeEvent;
        let addressInfo = data.split(',');
        if (addressInfo.length > 1) {
            address = addressInfo[0];
            addressName = addressInfo[3];
            longitude = addressInfo[1] + ',' + addressInfo[2];
        }
        const {goBack, state} = this.props.navigation;
        state.params.onCallBack && state.params.onCallBack(address, longitude, addressName);
        goBack();
    }

    render() {
        let {canPress, loading} = this.state;
        let {params} = this.props.navigation.state;
        let pageTitle = (params && params.pageTitle) ? params.pageTitle : '地址选择';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {pageTitle}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {!loading ?
                    <WebView
                        startInLoadingState={false}
                        source={{uri: this.state.url}}
                        style={styles.webContainer}
                        injectedJavaScript={patchPostMessageJsCode} // 注入js代码
                        onMessage={this.onMessage}
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