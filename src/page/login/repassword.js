/**
 * 速芽物流用户端 - Register
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'

import SendSMS from '../../component/common/sendSMS'

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            mobile: '',
            code: '',
            password: '',
            repassword: '',
            seconds: 60,
            codeAlreadySend: false,
            canBack: false,
        }
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
        this.timer && clearTimeout(this.timer);
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

    loadNetData = () => {}

    doRegister = () => {
        let {mobile, code, password, repassword} = this.state;
        let url = NetApi.rePasswd;
        let data = {
            mobile: mobile,
            code: code,
            password: password,
            repassword: repassword,
        };
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log('登录', result);
                if (result && result.code == 1) {
                    toastShort('成功找回密码,请重新登录');
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 500);
                }
            })
            .catch( error => {
                // console.log('登录出错', error);
            })
    }

    sendSMS = () => {
        let { mobile } = this.state;
        if (!mobile) {
            toastShort('手机号不能为空');
            return false;
        }
        let url = NetApi.sendPubSMS;
        let data = {
            mobile: mobile,
        };
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == 1) {
                    this.countDownTimer();
                    toastShort('验证码已发送，请注意查收！');
                }else{
                    toastShort(result.msg);
                }
                // console.log('验证码', result);
            })
            .catch( error => {
                toastShort('服务器请求失败，请稍后重试！');
                // console.log('登录出错', error);
            })
    }

    // 验证码倒计时
    countDownTimer(){
        this.setState({
            codeAlreadySend: true,
            seconds: 60,
        })
        this.timerInterval = setInterval(() => {
            if (this.state.seconds === 0) {
                return clearInterval(this.timerInterval);
            }

            this.setState({
                seconds: this.state.seconds - 1
            });
        }, 1000)
    }

    wechatLogin = () => {}
    qqLogin = () => {}

    render(){
        let { seconds, codeAlreadySend } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'找回密码'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />

                <KeyboardAwareScrollView>
                    <CustomKeyboard.AwareCusKeyBoardScrollView>
                        <View style={styles.logoView}>
                            <Image source={GlobalIcons.logo} style={GlobalStyles.logoIcon} />
                        </View>
                        <View style={styles.signView}>
                            <View style={styles.signItem}>
                                <CustomKeyboard.CustomTextInput
                                    style = {styles.inputItemCon}
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
                                {codeAlreadySend ?
                                    <View style={styles.btnCodeView}>
                                        {seconds === 0 ?
                                            <SendSMS title = '重新获取' sendSMS = {()=>this.sendSMS()} />
                                            :
                                            <SendSMS title = {`剩余${seconds}秒`} sendSMS = {()=> {}} />
                                        }
                                    </View>
                                    :
                                    <SendSMS title = '获取验证码' sendSMS = {()=>this.sendSMS()} />
                                }
                            </View>
                            <View style={GlobalStyles.horLine} />
                            <View style={styles.signItem}>
                                <CustomKeyboard.CustomTextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "验证码"
                                    placeholderTextColor = '#888'
                                    customKeyboardType = "numberKeyBoard"
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            code: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />
                            <View style={styles.signItem}>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "密码"
                                    secureTextEntry = {true}
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
                            <View style={styles.signItem}>
                                <TextInput
                                    style = {styles.inputItemCon}
                                    placeholder = "确认密码"
                                    secureTextEntry = {true}
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            repassword: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={GlobalStyles.horLine} />
                        </View>
                        <View style={styles.signBotView}>
                            <TouchableOpacity
                                style = {GlobalStyles.btnView}
                                onPress = {() => {this.doRegister()}}
                            >
                                <Text style={GlobalStyles.btnItem}>立即找回</Text>
                            </TouchableOpacity>
                        </View>
                    </CustomKeyboard.AwareCusKeyBoardScrollView>
                </KeyboardAwareScrollView>
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
    logoIcon: {
        width: GlobalStyles.width / 2.5,
        height: GlobalStyles.width / 2.5,
    },
    signView: {
        padding: 15,
        marginTop: 20,
    },
    signItem: {
        height: 50,
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
        height: 50,
        fontSize: 15,
    },
    otherBtnView: {
        height: 30,
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
        fontSize: 15,
        color: GlobalStyles.themeColor
    },
    iconCheck: {
        fontSize: 20,
        marginRight: 5,
        color: GlobalStyles.themeColor
    },
    otherLoginView: {
        marginTop: 50,
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
        fontSize: 12,
        color: '#666',
        marginHorizontal: 20,
    },
    otherLoginCon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otherLoginBtn: {
        width: 45,
        height: 45,
        marginHorizontal: 50,
    },
    otherLoginIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
});
