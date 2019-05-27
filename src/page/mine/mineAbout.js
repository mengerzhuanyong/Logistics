/**
 * 速芽物流用户端 - Cooperate
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

export default class Cooperate extends Component {

    constructor(props){
        super(props);
        this.state = {
            url: '',
            loading: true,
            canBack: false,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
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
        let url = NetApi.mineAbout;
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

    render() {
        let {loading} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'关于速芽'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {!loading ?
                    <WebView
                        ref={WEBVIEW_REF}
                        startInLoadingState={false}
                        source={{uri: this.state.url}}
                        style={styles.webContainer}
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