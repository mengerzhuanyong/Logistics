/**
 * 速芽物流用户端 - OrderPayment
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import * as wechat from 'react-native-wechat'
import Alipay from 'react-native-yunpeng-alipay'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'

import OrderItemView from '../../component/order/orderItem'

const checkedIcon = GlobalIcons.icon_checked;
const checkIcon = GlobalIcons.icon_check;

export default class OrderPayment extends Component {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {
            item: params ? params.item : '',
            paymentType: 1,
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        wechat.addListener('PayReq.Resp', (res) => {
            // console.log(res);
            if (res.errCode === 0) {
                toastShort('付款成功');
                setTimeout(() => {
                    this.props.navigation.state.params.reloadData();
                    this.props.navigation.navigate('Mine');
                }, 500);
            } else if (res.errCode === -1) {
                Alert.alert('支付失败,请稍后尝试');
            } else if (res.errCode === -2) {
                Alert.alert('支付被取消');
            }
        });
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        wechat.removeAllListeners();
    }

    onBack = () => {
        this.props.navigation.state.params.reloadData();
        this.props.navigation.goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = () => {

    }

    submitPayment = (orderid) => {
        let { paymentType } = this.state;

        let data = {
            order_id: orderid,
            payment: paymentType,
        }
        // console.log(paymentType);
        if (paymentType == 1) {
            wechat.isWXAppInstalled()
                .then((isInstalled) => {
                    if(isInstalled) {
                        let url = NetApi.orderWechatPay;
                        this.netRequest.fetchPost(url, data)
                            .then( result => {
                                // // console.log(result);
                                this.submitWechatPay(result.data);
                            })
                            .catch( error => {
                                // console.log('首页推荐', error);
                            })
                    }else{
                        toastShort('没有安装微信软件，请您安装微信之后再试');
                    }
                })
                .catch((error) => {
                    toastShort(error.message);
                });
        } else if (paymentType == 2) {
            let url = NetApi.orderAliPay;
            this.netRequest.fetchPost(url, data)
                .then( result => {
                    // // console.log(result);
                    if (result && result.code == 1) {
                        this.submitAlipay(result.data);
                    }
                })
                .catch( error => {
                    // console.log('首页推荐', error);
                })
        } else {
            let url = NetApi.orderBalancePay;
            this.netRequest.fetchPost(url, data)
                .then( result => {
                        // // console.log(result);
                    if (result && result.code == 1) {
                        toastShort('付款成功');
                        setTimeout(() => {
                            this.props.navigation.navigate('Mine');
                        }, 500);
                    } else {
                        toastShort(result.msg);
                    }
                })
                .catch( error => {
                    // console.log('首页推荐', error);
                })
        }
    }

    submitWechatPay = async (data) => {
        try {
            const Pay = await wechat.pay({
                appid: 'wxce5b49c03aa14b9d',
                partnerId: data.partnerid,        // 商家向财付通申请的商家id
                prepayId: data.prepayid,          // 预支付订单
                nonceStr: data.noncestr,          // 随机串，防重发
                timeStamp: data.timestamp,        // 时间戳，防重发
                package: data.package,            // 商家根据财付通文档填写的数据和签名
                sign: data.sign                   // 商家根据微信开放平台文档对数据做的签名
            });
            // console.log(Pay);
        } catch (error) {
            // console.log('付款失败：' + error);
        }
    }

    submitAlipay = (signed) => {
        const {navigate, state} = this.props.navigation;
        Alipay.pay(signed)
            .then(function(data) {
                toastShort('付款成功');
                setTimeout(() => {
                    state.params.reloadData();
                    navigate('Mine');
                }, 500);
            }, function(err) {
                toastShort(err.domain);
            });
    }

    render(){
        const {paymentType} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'支付订单'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <View style={styles.orderPayTitleView}>
                    <View style={styles.orderPayTitle}>
                        <Text style={styles.orderPayTitleName}>总计费用：</Text>
                    </View>
                    <View style={styles.orderPayTitleCon}>
                        <Text style={styles.orderPaymentNum}>50.00 <Text style={styles.orderPaymentUnit}>元</Text></Text>

                    </View>
                </View>
                <View style={styles.paymentMethodView}>
                    <TouchableOpacity style={styles.paymentMethodItem}
                        onPress = {() => {
                            this.updateState({
                                paymentType: 1,
                            })
                        }}
                    >
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                            <Text style={styles.paymentMethodTitle}>微信支付</Text>
                        </View>
                        <Image source={paymentType == 1 ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity style={styles.paymentMethodItem}
                        onPress = {() => {
                            this.updateState({
                                paymentType: 2,
                            })
                        }}
                    >
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_alipay} style={styles.paymentMethodIcon} />
                            <Text style={styles.paymentMethodTitle}>支付宝支付</Text>
                        </View>
                        <Image source={paymentType == 2 ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                </View>
                <View style={GlobalStyles.fixedBtnView}>
                    <TouchableOpacity
                        style = {[GlobalStyles.btnView, styles.btnView]}
                        onPress = {()=>this.submitPayment(1)}
                    >
                        <Text style={[GlobalStyles.btnItem, styles.btnItem]}>确认支付</Text>
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
    orderPayTitleView: {
        height: 70,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    orderPayTitleName: {
        fontSize: 18,
        color: '#444',
    },
    orderPayTitleCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderPaymentNum: {
        fontSize: 26,
        textAlignVertical: 'bottom',
        color: GlobalStyles.themeColor,
    },
    orderPaymentUnit: {
        fontSize: 16,
        color: '#555',
        marginLeft: 5,
    },
    paymentMethodView: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    paymentMethodItem: {
        marginTop: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paymentMethodTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentMethodIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'contain',
    },
    paymentMethodTitle: {
        color: '#333',
    },
    fixedBtnView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },
    btnView: {
        borderRadius: 5,
    },
    btnItem: {
        fontSize: 18,
    },
});