/**
 * 速芽物流用户端 - Login
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Alert,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import * as QQAPI from 'react-native-qq'
import * as wechat from 'react-native-wechat'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { NavigationActions } from 'react-navigation'

import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            mobile: '15066886007',
            password: '123123',
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
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
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        this.timer && clearTimeout(this.timer);
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

    loadNetData = () => {}

    doLogin = () => {
        let { mobile, password } = this.state;
        let url = NetApi.loginIn;
        let data = {
            mobile: mobile,
            password: password,
        };

        if (!data.mobile) {
            toastShort('手机号不能为空');
            return;
        }
        if (!data.password) {
            toastShort('密码不能为空');
            return;
        }

        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log('登录', result);
                if (result && result.code == '1') {
                    // console.log('登录返回', result);
                    toastShort("登录成功");
                    let user = result.data;

                    this.updateState({
                        user: user
                    });

                    storage.save({
                        key: 'loginState',
                        data: {
                            uid: user.id,
                            phone: data.mobile,
                            userName: user.username,
                            userAvatar: user.avatar,
                            token: 'token',
                        },
                    });

                    global.user = {
                        loginState: true,
                        userData: {
                            uid: user.id,
                            phone: data.mobile,
                            userName: user.username,
                            userAvatar: user.avatar,
                            token: 'token',
                        }
                    };

                    this.timer = setTimeout(() => {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'TabNavScreen'})
                            ]
                        })
                        this.props.navigation.dispatch(resetAction)
                    }, 500)
                } else {
                    toastShort(result.msg);
                    // console.log(result.msg);
                }
            })
            .catch( error => {
                // console.log('登录出错', error);
                toastShort("网络请求失败，请稍后重试！");
            })
    }

    onPushToNextPage = (pageTitle, component) => {
        let { navigate } = this.props.navigation;
        navigate(component, {
            pageTitle: pageTitle,
            reloadData: () => this.loadNetData(),
        })
    }

    getWechatCode = () => {
        let scope = 'snsapi_userinfo';
        let state = 'wechat_sdk';

        //判断微信是否安装
        wechat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    //发送授权请求
                    wechat.sendAuthRequest(scope, state)
                        .then(responseCode => {
                            //返回code码，通过code获取access_token
                            // console.log(responseCode.code);
                            this.wechatLogin(responseCode.code);
                        })
                        .catch(err => {
                            Alert.alert('登录授权发生错误：', err.message, [{
                                text: '确定'
                            }]);
                        })
                } else {
                    toastShort('没有安装微信软件，请您安装微信之后再试');
                }
            })
    }

    wechatLogin = (code) => {
        let url = NetApi.wechatLogin;
        let data = {
            code: code,
        };
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log('登录', result);
                if (result && result.code == '1') {
                    // console.log('登录返回', result);
                    toastShort("登录成功");
                    let user = result.data;

                    this.updateState({
                        user: user
                    });

                    storage.save({
                        key: 'loginState',
                        data: {
                            uid: user.id,
                            phone: data.mobile,
                            userName: user.username,
                            userAvatar: user.avatar,
                            token: 'token',
                        },
                    });

                    global.user = {
                        loginState: true,
                        userData: {
                            uid: user.id,
                            phone: data.mobile,
                            userName: user.username,
                            userAvatar: user.avatar,
                            token: 'token',
                        }
                    };

                    this.timer = setTimeout(() => {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'TabNavScreen'})
                            ]
                        })
                        this.props.navigation.dispatch(resetAction)
                    }, 500)
                } else {
                    toastShort(result.msg);
                    // console.log(result.msg);
                }
            })
            .catch( error => {
                // console.log('登录出错', error);
                toastShort("网络请求失败，请稍后重试！");
            })
    }

    getTencentCode = () => {
        QQAPI.isQQInstalled()
            .then( result => {
                QQAPI.login()
                    .then( result => {
                        this.qqLogin(result);
                        // // console.log(result);
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

    qqLogin = (data) => {
        let url = NetApi.qqLogin;
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log('登录', result);
                if (result && result.code == '1') {
                    // console.log('登录返回', result);
                    toastShort("登录成功");
                    let user = result.data;

                    this.updateState({
                        user: user
                    });

                    storage.save({
                        key: 'loginState',
                        data: {
                            uid: user.id,
                            phone: data.mobile,
                            userName: user.username,
                            userAvatar: user.avatar,
                            token: 'token',
                        },
                    });

                    global.user = {
                        loginState: true,
                        userData: {
                            uid: user.id,
                            phone: data.mobile,
                            userName: user.username,
                            userAvatar: user.avatar,
                            token: 'token',
                        }
                    };

                    this.timer = setTimeout(() => {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'TabNavScreen'})
                            ]
                        })
                        this.props.navigation.dispatch(resetAction)
                    }, 500)
                } else {
                    toastShort(result.msg);
                    // console.log(result.msg);
                }
            })
            .catch( error => {
                // console.log('登录出错', error);
                toastShort("网络请求失败，请稍后重试！");
            })
    }

    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'用户登录'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <ScrollView style={styles.container}>
                    <View style={styles.logoView}>
                        <Image source={GlobalIcons.logo} style={GlobalStyles.logoIcon} />
                    </View>
                    <View style={styles.signView}>
                        <View style={styles.signItem}>
                            <CustomKeyboard.AwareCusKeyBoardScrollView style={styles.inputItemCon}>
                                <CustomKeyboard.CustomTextInput
                                    placeholder = "手机号"
                                    maxLength = {11}
                                    placeholderTextColor = '#888'
                                    customKeyboardType = "numberKeyBoard"
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        })
                                    }}
                                />
                            </CustomKeyboard.AwareCusKeyBoardScrollView>
                        </View>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "密码"
                                keyboardType = "email-address"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        password: text
                                    })
                                }}
                            />
                        </View>
                        <View style={GlobalStyles.horLine} />
                    </View>
                    <View style={styles.signBotView}>
                        <TouchableOpacity
                            style = {GlobalStyles.btnView}
                            onPress = {() => {this.doLogin()}}
                        >
                            <Text style={GlobalStyles.btnItem}>登录</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.otherBtnView}>
                        <TouchableOpacity
                            style = {styles.otherBtnItem}
                            onPress = {() => {this.onPushToNextPage('账号注册', 'Register')}}
                        >
                            <Text style={styles.otherBtnName}>账号注册</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {styles.otherBtnItem}
                            onPress = {() => {this.onPushToNextPage('找回密码', 'Repassword')}}
                        >
                            <Text style={styles.otherBtnName}>忘记密码？</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.otherLoginView}>
                        <View style={styles.otherLoginTitle}>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <Text style={styles.titleName}>其他账号登录</Text>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                        </View>
                        <View style={styles.otherLoginCon}>
                            <TouchableOpacity
                                style = {styles.otherLoginBtn}
                                onPress = {()=>this.getWechatCode()}
                            >
                                <Image source={GlobalIcons.icon_wechat} style={styles.otherLoginIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = {styles.otherLoginBtn}
                                onPress = {()=>this.getTencentCode()}
                            >
                                <Image source={GlobalIcons.icon_qq} style={styles.otherLoginIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoView: {
        marginTop: 20,
        alignItems: 'center',
    },
    signView: {
        padding: 15,
        marginTop: 20,
    },
    signItem: {
        height: 45,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: GlobalStyles.width - 30,
    },
    inputItemIcon: {
        width: 40,
        height: 25,
        resizeMode: 'contain',
    },
    inputItemCon: {
        flex: 1,
        height: 45,
        fontSize: 15,
    },
    otherBtnView: {
        // height: 25,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    otherBtnItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    otherBtnName: {
        fontSize: 13,
        color: GlobalStyles.themeColor
    },
    iconCheck: {
        fontSize: 20,
        marginRight: 5,
        color: GlobalStyles.themeColor
    },
    otherLoginView: {
        marginTop: 40,
        alignItems: 'center',
    },
    otherLoginTitle: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    horLine: {
        width: GlobalStyles.width * 0.25,
        backgroundColor: '#ddd',
    },
    titleName: {
        fontSize: 11,
        color: '#888',
        marginHorizontal: 20,
    },
    otherLoginCon: {
        marginBottom: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otherLoginBtn: {
        width: 40,
        height: 40,
        marginHorizontal: 50,
    },
    otherLoginIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
});
