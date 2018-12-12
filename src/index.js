/**
 * 速芽物流用户端 - App主页面
 * http://menger.me
 * @大梦
 */

import React, { Component } from 'react'
import { Image, Platform, InteractionManager } from 'react-native'
// import Geolocation from 'Geolocation'
import * as wechat from 'react-native-wechat'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import SplashScreen from 'react-native-splash-screen'
import JPushModule from 'jpush-react-native'

import GlobalStyles from './constant/GlobalStyle'
import GlobalIcons from './constant/GlobalIcon'
import AppNavigation from './router'
import NetRequest from './util/utilsRequest'
import NetApi from './constant/GlobalApi'
import { toastShort, consoleLog } from './util/utilsToast'

const __IOS__ = Platform.OS === 'ios';

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
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
            });
        }, 3000);
        wechat.registerApp(NetApi.wechatAppid);
        this.registerKeyBoard();
        this.jpushRelative();
        // this.getCurrentPosition();
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
        JPushModule.clearAllNotifications();
    }

    postLocation = (location) => {
        let url = NetApi.postLongitude;
        let data = {
            lat: location.lat,
            lng: location.lng
        };
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log(result.msg);
            })
            .catch( error => {
                // console.log('网络请求失败', error);
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
                toastShort('获取当前位置失败，请稍后重试！');
                // console.log("获取位置失败：", error)
            },
            para
        );
    }
    
    setBadge() {
        JPushModule.setBadge(0, (badgeNumber) => {
            // console.log(badgeNumber);
            // alert(badgeNumber);
        })
    }

    jumpSecondActivity = () => {
        // console.log('jump to SecondActivity');
        // this.props.navigation.navigate('Mine');
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
        __IOS__ && this.setBadge();
        JPushModule.addReceiveCustomMsgListener(map => {
            // this.setState({
            //     pushMsg: map.message
            // })
            // console.log('extras: ' + map.extras)
        })

        JPushModule.addReceiveNotificationListener(map => {
            // console.log('alertContent: ' + map.alertContent)
            // console.log('extras: ' + map.extras)
            // var extra = JSON.parse(map.extras);
            // console.log(extra.key + ": " + extra.value);
        })

        JPushModule.addReceiveOpenNotificationListener(map => {
            __IOS__ && this.setBadge();
            // console.log('Opening notification!')
            // console.log('map.extra: ' + map.extras)
            // this.jumpSecondActivity();
            // JPushModule.jumpToPushActivity("SecondActivity");
        })

        JPushModule.addGetRegistrationIdListener(registrationId => {
            // console.log('Device register succeed, registrationId ' + registrationId)
        })
        // console.log('推送');
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
        CustomKeyboard.keyBoardAPI('numberKeyBoardWithDot')(class extends Component{
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