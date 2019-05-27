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
import SplashScreen from 'react-native-splash-screen'
import { toastShort, consoleLog } from './src/util/utilsToast'
import NetRequest from './src/util/utilsRequest'
import { NetApi } from './src/constant/GlobalApi'
import Geolocation from 'Geolocation'

export default class App extends Component < {} > {

    constructor(props) {
        super(props);
        this.state =  {
            location: ''
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        SplashScreen.hide();
        this.getCurrentPosition();
    }

    postLocation = (location) => {
        let url = NetApi.postLongitude;
        let data = {
            lat: location.lat,
            lng: location.lng
        };
        this.netRequest.fetchPost(url, data, true)
            .then( result => {
                console.log(result.msg);
            })
            .catch( error => {
                console.log('网络请求失败', error);
            })
    }

    //开始监听位置变化
    getCurrentPosition = () => {
        let para = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        };
        Geolocation.getCurrentPosition(
            location => {
                let result = {
                    lng: location.coords.longitude,
                    lat: location.coords.latitude
                };
                this.postLocation(result);
            },
            error => {
                console.log("获取位置失败：" + error)
            },
            para
        );
    }
    
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.getCurrentPosition()} >
                    <Text style={styles.item}>开始监听</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.stopWatch()} >
                     <Text style={styles.item}>停止监听</Text>
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