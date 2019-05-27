/**
 * 速芽物流用户端 - App主页面
 * http://menger.me
 * @大梦
 */

import React, { Component } from 'react'
import { Image, Platform, InteractionManager } from 'react-native'
import * as wechat from 'react-native-wechat'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import SplashScreen from 'react-native-splash-screen'
import JPushModule from 'jpush-react-native'

import GlobalStyles from './constant/GlobalStyle'
import GlobalIcons from './constant/GlobalIcon'
import AppNavigation from './router'
import NetRequest from './util/utilsRequest'
import NetApi from './constant/GlobalApi'

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            pushMsg: '',
            appkey: 'AppKey',
            imei: 'IMEI',
            package: 'PackageName',
            deviceId: 'DeviceId',
            version: 'Version',
            pushMsg: 'PushMessage',
            registrationId: 'registrationId',
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount (){
        this.getLocation();
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
            });
        }, 3000);
        wechat.registerApp(NetApi.wechatAppid);
        this.registerKeyBoard();
        this.jpushRelative();
    }

    getLocation = () => {
        let para = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        }
        navigator.geolocation.getCurrentPosition(
            this.getPositionResult,
            this.logError,
            para
        );
        this.watchID = navigator.geolocation.watchPosition(
            this.getPositionResult
        );
    }

    getPositionResult(aPosition){
        global.latitude = aPosition.coords.latitude > 0 ? aPosition.coords.latitude : -aPosition.coords.latitude;
        global.longitude = aPosition.coords.longitude > 0 ? aPosition.coords.longitude : -aPosition.coords.longitude;
        // console.log(aPosition);
        // console.log(global);
        return global;
    }


    logError(aError){
        // console.log(aError);
    }

    setBadge() {
        JPushModule.setBadge(0, (badgeNumber) => {
            // console.log(badgeNumber);
            alert(badgeNumber);
        })
    }

    jumpSecondActivity = () => {
        // console.log('jump to SecondActivity');
        this.props.navigation.navigate('Mine');
    }

    jpushRelative = () => {
        if (Platform.OS === 'android') {
            JPushModule.initPush()
            JPushModule.getInfo(map => {
                this.setState({
                    appkey: map.myAppKey,
                    imei: map.myImei,
                    package: map.myPackageName,
                    deviceId: map.myDeviceId,
                    version: map.myVersion
                })
            })
            JPushModule.notifyJSDidLoad(resultCode => {
                if (resultCode === 0) {}
            })
        }

        JPushModule.addReceiveCustomMsgListener(map => {
            this.setState({
                pushMsg: map.message
            })
            // console.log('extras: ' + map.extras)
        })

        JPushModule.addReceiveNotificationListener(map => {
            // console.log('alertContent: ' + map.alertContent)
            // console.log('extras: ' + map.extras)
            // var extra = JSON.parse(map.extras);
            // console.log(extra.key + ": " + extra.value);
        })

        JPushModule.addReceiveOpenNotificationListener(map => {
            // console.log('Opening notification!')
            // console.log('map.extra: ' + map.extras)
            this.jumpSecondActivity();
            this.setBadge();
            // JPushModule.jumpToPushActivity("SecondActivity");
        })

        JPushModule.addGetRegistrationIdListener(registrationId => {
            // console.log('Device register succeed, registrationId ' + registrationId)
        })
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
        JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
        JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
        JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
        JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
        // console.log("Will clear all notifications");
        JPushModule.clearAllNotifications();
    }

    registerKeyBoard = () => {
        CustomKeyboard.keyBoardAPI('numberKeyBoard')(class extends Component{
            static getKeyBoardIcon = () => {
                return <Image source={GlobalIcons.anquanbaohu} style={GlobalStyles.keyBoardIcon}/>
            }

            static getKeyBoardName = () => {
                return "安全键盘"
            }

            render() {
                return (
                    <CustomKeyboard.NumberKeyBoardView
                        keyboardType={"number-pad"}
                        disableOtherText={true}
                        disableDot={true}
                        {...this.props}
                    />
                )
            }
        })
    }

    render() {
        return (
            <AppNavigation />
        );
    }
};