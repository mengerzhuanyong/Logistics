/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import * as QQAPI from 'react-native-qq'
import SplashScreen from 'react-native-splash-screen'
import { toastShort, consoleLog } from './src/util/utilsToast'
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export default class App extends Component < {} > {
    componentDidMount() {
        SplashScreen.hide();
    }

    getTencentCode = () => {
        QQAPI.isQQInstalled()
            .then( result => {
               QQAPI.login()
                .then( result => {
                    console.warn(result);
                })
                .catch( error => {
                    // console.log('登录出错', error);
                    toastShort("网络请求失败，请稍后重试！");
                })
            })
            .catch( error => {
                toastShort('您还没有安装QQ客户端，请安装QQ后再试');
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress = {() => {this.getTencentCode()}}
                >
                    <Text style={styles.welcome}>Welcome to React Native!</Text>
                    <Text style={styles.instructions}>To get started, edit App.js</Text>
                    <Text style={styles.instructions}>{instructions}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});