/**
 * 速芽物流用户端 - MineInfoSetting
 * http://menger.me
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

import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'
import SendSMS from '../../component/common/sendSMS'

export default class MineInfoSetting extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            user: params.user ? params.user : global.user,
            uid: params.user ? params.user.uid : '',
            phone: params.user ? params.user.phone : '',
            code: '',
            seconds: 60,
            newMobile: '',
            loading: false,
            codeAlreadySend: false,
            canPress: true,
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
        this.timerInterval && clearInterval(this.timerInterval);
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

    submitChange = () => {
        let { uid, newMobile, code, canPress } = this.state;
        let url = NetApi.minePhone;
        let data = {
            uid: uid,
            code: code,
            mobile: newMobile,
        };
        if (code === '') {
            toastShort('请输入验证码');
            return;
        }
        if (newMobile === '') {
            toastShort('请输入新手机号');
            return;
        }
        this.updateState({
            canPress: false
        })
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == 1) {
                    toastShort(result.msg);
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 1000);
                }else{
                    toastShort(result.msg);
                }
                // console.log('修改手机号', result);
            })
            .catch( error => {
                toastShort('服务器请求失败，请稍后重试！');
                this.updateState({
                    canPress: true
                })
                // console.log('登录出错', error);
            })
    }

    renderRightButton = () => {
        let { canPress } = this.state;
        return (
            <TouchableOpacity
                style = {GlobalStyles.rightButton}
                onPress = {() => {canPress && this.submitChange()}}
            >
                <Text style={GlobalStyles.rightButtonName}>保存</Text>
            </TouchableOpacity>
        )
    }

    sendSMS = (phone) => {
        // phone = 15066660000;
        let url = NetApi.sendPubSMS;
        if (!phone) {
            toastShort('手机号有误');
            return false;
        }
        let data = {
            mobile: phone,
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

    render(){
        let { phone, loading, seconds, codeAlreadySend, newMobile } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'手机设置'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    // rightButton = {this.renderRightButton()}
                />
                {phone ?
                    <View style={styles.signView}>
                        <View style={styles.signItem}>
                            <Text style = {styles.inputItemConText}>{phone}</Text>

                            {codeAlreadySend ?
                                <View style={styles.btnCodeView}>
                                    {seconds === 0 ?
                                        <SendSMS title = '重新获取' sendSMS = {()=>this.sendSMS(phone)} />
                                        :
                                        <SendSMS title = {`剩余${seconds}秒`} sendSMS = {()=> {}} />
                                    }
                                </View>
                                :
                                <SendSMS title = '获取验证码' sendSMS = {()=>this.sendSMS(phone)} />
                            }
                        </View>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "验证码"
                                keyboardType = {'numeric'}
                                placeholderTextColor = '#888'
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
                                placeholder = "请输入新手机号"
                                maxLength = {11}
                                keyboardType = {'numeric'}
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        newMobile: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                    :
                    <View style={styles.signView}>
                        <View style={styles.signItem}>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "请输入手机号"
                                maxLength = {11}
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        newMobile: text
                                    })
                                }}
                            />
                            {codeAlreadySend ?
                                <View style={styles.btnCodeView}>
                                    {seconds === 0 ?
                                        <SendSMS title = '重新获取' sendSMS = {()=>this.sendSMS(newMobile)} />
                                        :
                                        <SendSMS title = {`剩余${seconds}秒`} sendSMS = {()=> {}} />
                                    }
                                </View>
                                :
                                <SendSMS title = '获取验证码' sendSMS = {()=>this.sendSMS(newMobile)} />
                            }
                        </View>
                        <View style={GlobalStyles.horLine} />
                        <View style={styles.signItem}>
                            <TextInput
                                style = {styles.inputItemCon}
                                placeholder = "验证码"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        code: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                }

                <View style={[GlobalStyles.btnView, styles.btnView]}>
                    <TouchableOpacity
                        style = {GlobalStyles.btnView}
                        onPress = {() => {this.submitChange()}}
                    >
                        <Text style={GlobalStyles.btnItem}>{phone ? '确认修改' : '立即绑定' }</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    horLine: {},
    signView: {
        padding: 15,
        // marginTop: 20,
        backgroundColor: '#fff',
    },
    signItem: {
        height: 50,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    inputItemConText: {
        fontSize: 15,
        color: '#666',
    },
});
