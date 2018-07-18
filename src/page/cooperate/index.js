/**
 * 速芽物流用户端 - Cooperate
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
import NavigatorItem from '../../component/mine/navigatorItem'
import NavigationsData from '../../asset/json/systemNavigations.json'

const WEBVIEW_REF = 'webview';

export default class Cooperate extends Component {

    constructor(props){
        super(props);
        this.state = {
            url: '',
            canBack: false,
            navigations: NavigationsData.data.cooperateNavigations,
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
        let message = 'refresh';
        // this.webview.postMessage(message);
        // console.log(message);
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
        let url = NetApi.cooperate;
        this.netRequest.fetchGet(url, true)
            .then( result => {
                this.updateState({
                    navigations: result.data
                })
                // console.log(result);
            })
            .catch( error => {
                // consoleLog('登录出错', error);
            })
    };

    onNavigationStateChange = () => {
        alert(123);
    };

    onPushNavigator = (pageTitle, compent, link) => {
        let {user, loginState} = this.state;
        let {navigate} = this.props.navigation;
        navigate(compent, {
            user: user,
            pageTitle: pageTitle,
            webUrl: link,
        })
    };


    render() {
        let {navigations} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'我要合作'}
                    // leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <View style={styles.content}>
                    <NavigatorItem
                        leftIcon = {false}
                        leftTitle = {navigations[0].name}
                        onPushNavigator = {() => this.onPushNavigator('招商加盟', 'CooperateDetail', navigations[0].link)}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {false}
                        leftTitle = {navigations[1].name}
                        onPushNavigator = {() => this.onPushNavigator('招聘', 'CooperateDetail', navigations[1].link)}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {false}
                        leftTitle = {navigations[2].name}
                        onPushNavigator = {() => this.onPushNavigator('服务点加盟', 'CooperateDetail', navigations[2].link)}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    {1> 2 && <NavigatorItem
                        leftIcon = {false}
                        leftTitle = {navigations[3].name}
                        onPushNavigator = {() => this.onPushNavigator('货车加盟', 'CooperateDetail', navigations[3].link)}
                        // <View style={[GlobalStyles.horLine, styles.horLine]} />
                    />}
                    <NavigatorItem
                        leftIcon = {false}
                        leftTitle = {navigations[4].name}
                        onPushNavigator = {() => this.onPushNavigator('可申请加盟的区域', 'CooperateDetail', navigations[4].link)}
                    />
                </View>
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
    content: {
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    horLine: {
        marginVertical: 10,
    },
});