/**
 * 速芽物流用户端 - OrderDetail
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Alert,
    Image,
    Modal,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import {ACTION_MINE, ACTION_FLOW} from '../../constant/EventActions'
import * as wechat from 'react-native-wechat'
import Alipay from 'react-native-yunpeng-alipay'
import NetRequest from '../../util/utilsRequest'
import ModalView from '../../util/utilsDialogs'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'

const isIos = Platform.OS === 'ios';

const checkIcon = GlobalIcons.icon_check;
const checkedIcon = GlobalIcons.icon_checked;
const PAY_MODAL_CONFIG = {
    title: '确认支付',
    modalText: '您确认要支付该订单吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};
const CANCEL_MODAL_CONFIG = {
    title: '确认取消',
    modalText: '您确认要取消该订单吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};

export default class OrderDetail extends Component {

    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state;
        this.state =  {
            showPayModal: false,
            showCancelModal: false,
            ready: false,
            orderid: params.orderid,
            orderInfo: {},
            paymentType: 1, // 0 未付款 1 微信 2 支付宝 3 到付
            modalVisiable: false,
            images: [],
            imageIndex: 1,
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    static defaultProps = {

    }

    async componentDidMount(){
        // let result = await this.loadNetData();
        this.loadNetData();
        wechat.addListener('PayReq.Resp', (res) => {
            // console.log(res);
            if (res.errCode === 0) {
                toastShort('付款成功');
                this.timer = setTimeout(() => {
                    this.props.navigation.state.params.reloadData();
                    this.props.navigation.navigate('Order', {
                        activeTabIndex: 1
                    });
                }, 500);
                // console.log(111);
            } else if (res.errCode === -1) {
                toastShort('支付失败,请稍后尝试');
            } else if (res.errCode === -2) {
                toastShort('支付被取消');
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
        this.onBack();
        this.timer && clearTimeout(this.timer);
        wechat.removeAllListeners();
        DeviceEventEmitter.emit('ACTION_FLOW', ACTION_FLOW.A_RESTART);
    }

    onBack = () => {
        let {state, navigate, goBack} = this.props.navigation;
        state.params.reloadData();
        if (state.params.PAGE_FLAG === 'FLOW') {
            navigate('Order');
        } else {
            goBack();
        }
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    showPayModal = () => {
        this.updateState({
            showPayModal: !this.state.showPayModal
        })
    };

    showCancelModal = () => {
        this.updateState({
            showCancelModal: !this.state.showCancelModal
        })
    };

    loadNetData = () => {
        let { orderid } = this.state;
        let url = NetApi.orderDetail + orderid;
        // return this.netRequest.fetchGet(url)
        this.netRequest.fetchGet(url)
            .then( result => {
                // return result;
                if (result && result.code == 1) {
                    this.updateState({
                        ready: true,
                        orderInfo: result.data,
                        images: result.data.images,
                        paymentType: result.data.pay_class,
                    })
                }
                // console.log('订单详情', result);
            })
            .catch( error => {
                // console.log('订单详情', error);
            })
    }

    renderOrderUserInfo = (type, orderUser) => {
        return (
            <View style={styles.addressDetailView}>
                <View style={styles.addressDetailItemView}>
                    <Text style={styles.addressUserInfo}>{type}人：</Text>
                    <Text style={styles.addressUserName}>{orderUser.name} <Text style={styles.addressUserPhone}>{orderUser.phone}</Text></Text>
                </View>
                <View style={styles.addressDetailItemView}>
                    <Text style={[styles.addressDetailConTitle]}>{type}地址：</Text>
                    <Text style={styles.addressDetailCon} numberOfLines={2}>{orderUser.address}</Text>
                </View>
            </View>
        )
    }

    onSelectedPayment = (type) => {
        // console.log(type);
        this.updateState({
            paymentType: type
        })
    }

    cancelOrder = (orderid) => {
        this.showCancelModal();
        let url = NetApi.orderCancel + orderid;
        this.netRequest.fetchGet(url)
            .then(result => {
                if (result && result.code == 1) {
                    toastShort(result.msg);
                    this.loadNetData();
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    }

    submitPayment = (orderid) => {
        this.showPayModal();
        let { paymentType } = this.state;
        // console.log(paymentType);
        // return;
        if (paymentType === 1) {
            wechat.isWXAppInstalled()
                .then((isInstalled) => {
                    if(isInstalled) {
                        let url = NetApi.orderWechatPay + orderid;
                        this.netRequest.fetchGet(url)
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
        } else if (paymentType === 2) {
            // toastShort('没有安装支付宝软件，请您安装支付宝之后再试');
            let url = NetApi.orderAliPay + orderid;
            this.netRequest.fetchGet(url)
                .then( result => {
                    // // console.log(result);
                    this.submitAlipay(result.data);
                })
                .catch( error => {
                    // console.log('首页推荐', error);
                })
        } else if (paymentType === 3) {
            let url = NetApi.orderOnDelivery + orderid;
            const {navigate, state} = this.props.navigation;
            this.netRequest.fetchGet(url)
                .then( result => {
                    if (result && result.code == 1) {
                        setTimeout(() => {
                            state.params.reloadData();
                            navigate('Order', {
                                activeTabIndex: 1
                            });
                        }, 500);
                    }
                })
                .catch( error => {
                    // console.log('首页推荐', error);
                })
        } else {
            toastShort('请选择支付方式');
            return;
        }
    }

    submitWechatPay = async (data) => {
        // // console.log(data);
        try {
            const Pay = await wechat.pay({
                appid: NetApi.wechatAppid,
                partnerId: data.partnerid,        // 商家向财付通申请的商家id
                prepayId: data.prepayid,          // 预支付订单
                nonceStr: data.noncestr,          // 随机串，防重发
                timeStamp: data.timestamp,        // 时间戳，防重发
                package: data.package,            // 商家根据财付通文档填写的数据和签名
                sign: data.sign                   // 商家根据微信开放平台文档对数据做的签名
            });
            // console.log(Pay);
        } catch (error) {
            // console.log('付款失败：', error);
        }
    }

    submitAlipay = (signed) => {
        // console.log(signed);
        const {navigate, state} = this.props.navigation;
        Alipay.pay(signed)
            .then(function(data) {
                isIos && toastShort('付款成功');
                setTimeout(() => {
                    state.params.reloadData();
                    navigate('Order', {
                        activeTabIndex: 1
                    });
                }, 500);
            }, function(err) {
                toastShort(err.domain);
            });
    }

    onPushToNextPage = (component, item) => {
        const { navigate } = this.props.navigation;
        navigate(component, {
            item: item,
            orderid: item.id,
            pageTitle: 'pageTitle',
            reloadData: () => this.loadNetData(),
        })
    }

    renderGoodsPic = (data) => {
        // // console.log(data);
        let images = data.map((obj, index) => {
            return (
                <TouchableOpacity
                    key={obj+index}
                    onPress = {() => {
                        this.updateState({
                            modalVisiable: true,
                            imageIndex: index,
                        })
                    }}
                >
                    <Image source={{uri: obj.url}} style={styles.orderGoodsPic} />
                </TouchableOpacity>
            );
        })
        return images;
    }

    renderOrderButton = (data) => {
        let Buttons = <View />
        let status = parseInt(data.status);
        switch(status) {
            // 未付款
            case 0:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                        <TouchableOpacity
                            style = {styles.btnItemView}
                            onPress = {() => this.showCancelModal()}
                        >
                            <Text style={styles.btnItemName}>取消订单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {[styles.btnItemView, styles.btnItemViewCur]}
                            onPress = {() => this.showPayModal()}
                        >
                            <Text style={[styles.btnItemName, styles.btnItemNameCur]}>立即付款</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            // 待接单
            case 1:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                        <TouchableOpacity
                            style = {[styles.btnItemView]}
                            onPress = {() => this.showCancelModal()}
                        >
                            <Text style={[styles.btnItemName]}>取消订单</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            // 运输中
            case 2:
                Buttons = <View />;
                break;
            // 待评价
            case 3:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                        <TouchableOpacity
                            style = {[styles.btnItemView, styles.btnItemViewCur]}
                            onPress = {() => this.onPushToNextPage('OrderComment', data)}
                        >
                            <Text style={[styles.btnItemName, styles.btnItemNameCur]}>立即评价</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            // 已完成
            case 4:
                Buttons = <View />;
                break;
            // 退款申请中
            case 5:
                Buttons = <View />;
                break;
            // 退款成功
            case 6:
                Buttons = <View />;
                break;
            // 等待取货
            case 7:
                Buttons = <View style={[GlobalStyles.fixedBtnView, styles.orderDetailBtnView]}>
                        <TouchableOpacity
                            style = {styles.btnItemView}
                            onPress = {() => this.showCancelModal()}
                        >
                            <Text style={styles.btnItemName}>取消订单</Text>
                        </TouchableOpacity>
                    </View>;
                break;
            // 待收货
            case 8:
                Buttons = <View />;
                break;
            default:
                Buttons = <View />;
                break;
        }
        return Buttons;
    }

    renderPayment = (data) => {
        // 订单状态：0 未付款 1 待接单 2 运输中 3 待评价 4 已完成 5 退款申请中 6 退款成功 7 等待取货 8 待收货
        // 0 未付款 1 微信 2支付宝
        // console.log('订单信息----',data);
        type = parseInt(data.pay_class);
        reBack = parseInt(data.status);
        let {paymentType, orderInfo} = this.state;
        if (reBack == 6) {
            if (type == 1) {
                return (
                    <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                        <View style={styles.orderMoneyInfoItem}>
                            <Text style={styles.orderMoneyInfoTitle}>退款方式</Text>
                            <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>退款至微信</Text>
                        </View>
                    </View>
                );
            } else {
                return (
                    <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                        <View style={styles.orderMoneyInfoItem}>
                            <Text style={styles.orderMoneyInfoTitle}>退款方式</Text>
                            <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>退款至支付宝</Text>
                        </View>
                    </View>
                );
            }
        }
        if (type === 0) {
            return (
                <View style={styles.chargePayTypeView}>
                    <Text style={styles.viewTitle}>请选择支付方式</Text>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity
                        style = {styles.chargeTypeItem}
                        onPress = {() => this.onSelectedPayment(1)}
                    >
                        <View style={styles.chargeTypeTitle}>
                            <Image source={GlobalIcons.icon_wechat} style={styles.itemTitleIcon}/>
                            <Text style={styles.itemTitle}>微信支付</Text>
                        </View>
                        <Image source={paymentType === 1 ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon}/>
                    </TouchableOpacity>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity
                        style = {styles.chargeTypeItem}
                        onPress = {() => this.onSelectedPayment(2)}
                    >
                        <View style={styles.chargeTypeTitle}>
                            <Image source={GlobalIcons.icon_alipay} style={styles.itemTitleIcon}/>
                            <Text style={styles.itemTitle}>支付宝支付</Text>
                        </View>
                        <Image source={paymentType === 2 ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon}/>
                    </TouchableOpacity>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    {orderInfo.premiums === '0.00' && <TouchableOpacity
                        style = {styles.chargeTypeItem}
                        onPress = {() => this.onSelectedPayment(3)}
                    >
                        <View style={styles.chargeTypeTitle}>
                            <Image source={GlobalIcons.icon_cash_on_delivery} style={styles.itemTitleIcon}/>
                            <Text style={styles.itemTitle}>货到付款</Text>
                        </View>
                        <Image source={paymentType === 3 ? checkedIcon : checkIcon} style={GlobalStyles.checkedIcon}/>
                    </TouchableOpacity>}
                </View>
            );
        } else if (type === 1) {
            return (
                <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                    <View style={styles.orderMoneyInfoItem}>
                        <Text style={styles.orderMoneyInfoTitle}>支付方式</Text>
                        <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>微信支付</Text>
                    </View>
                </View>
            );
        } else if (type === 2) {
            return (
                <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                    <View style={styles.orderMoneyInfoItem}>
                        <Text style={styles.orderMoneyInfoTitle}>支付方式</Text>
                        <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>支付宝支付</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                    <View style={styles.orderMoneyInfoItem}>
                        <Text style={styles.orderMoneyInfoTitle}>支付方式</Text>
                        <Text style={styles.orderMoneyInfoCon, {color: GlobalStyles.themeColor}}>货到付款</Text>
                    </View>
                </View>
            );
        }
    }

    render(){
        let { orderInfo, paymentType, images, imageIndex, ready, modalVisiable, showPayModal, showCancelModal } = this.state;
        let noMarginBottom = orderInfo.status == 2 || orderInfo.status == 4 || orderInfo.status == 6 || orderInfo.status == 8 || orderInfo.status == 9;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'订单详情'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {ready ?
                    <ScrollView style={[GlobalStyles.hasFixedContainer, styles.scrollViewContainer, noMarginBottom && styles.noMarginBottom]}>
                        <View style={[styles.containerItemView, styles.addressInfoView]}>
                            <View style={styles.addressLeftView}>
                                <View style={[GlobalStyles.placeViewIcon, styles.placeViewIcon, GlobalStyles.placeStartIcon]}>
                                    <Text style={GlobalStyles.placeText}>发</Text>
                                </View>
                                <View style={[GlobalStyles.verLine, styles.verLine]} />
                                <View style={[GlobalStyles.placeViewIcon, styles.placeViewIcon, GlobalStyles.placeEndIcon]}>
                                    <Text style={GlobalStyles.placeText}>收</Text>
                                </View>
                            </View>
                            <View style={styles.addressRightView}>
                                {this.renderOrderUserInfo('发货', orderInfo.shipper)}
                                <View style={[GlobalStyles.horLine, styles.horLine]} />
                                {this.renderOrderUserInfo('收货', orderInfo.receiver)}
                            </View>
                        </View>

                        <View style={[styles.containerItemView, styles.orderInfoView]}>
                            <View style={styles.orderInfoItemView}>
                                <Image source={orderInfo.logo ? {uri: orderInfo.logo} : GlobalIcons.banner1} style={styles.OrderInfoImage} />
                                <View style={styles.orderCompanyInfo}>
                                    <View style={[styles.orderCompanyInfoItem, styles.orderStatusView]}>
                                        <Text style={styles.orderCompanyInfoTitle}>订单状态：</Text>
                                        <Text style={[styles.orderCompanyInfoCon, styles.orderStatus]}>{orderInfo.statusName}</Text>
                                    </View>
                                    <View style={styles.orderCompanyInfoItem}>
                                        <Text style={styles.orderCompanyInfoTitle}>物流公司：</Text>
                                        <Text style={[styles.orderCompanyInfoCon, {alignItems: 'flex-start'}]} numberOfLines={2}>{orderInfo.storeName}</Text>
                                    </View>
                                    <View style={styles.orderCompanyInfoItem}>
                                        <Text style={styles.orderCompanyInfoTitle}>物流订单号：</Text>
                                        <Text style={styles.orderCompanyInfoCon}>{orderInfo.code}</Text>
                                    </View>
                                    {orderInfo.pick_up_time != '0' &&<View style={styles.orderCompanyInfoItem}>
                                        <Text style={styles.orderCompanyInfoTitle}>商家取货时间：</Text>
                                        <Text style={styles.orderCompanyInfoCon}>{orderInfo.pick_up_time}</Text>
                                    </View>}
                                    {orderInfo.arrival_time !=  '0' &&<View style={styles.orderCompanyInfoItem}>
                                        <Text style={styles.orderCompanyInfoTitle}>司机抵达时间：</Text>
                                        <Text style={styles.orderCompanyInfoCon}>{orderInfo.arrival_time}</Text>
                                    </View>}
                                </View>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={[styles.orderCargoInfoView]}>
                                <View style={styles.orderCargoInfoItem}>
                                    {orderInfo.cargo_name ? <View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>货物名称：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.cargo_name}</Text>
                                    </View> : null }
                                    <View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>路线：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.service}</Text>
                                    </View>
                                    <View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>班次：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.time}</Text>
                                    </View>
                                    {orderInfo.weight ? <View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>重量：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.weight}kg</Text>
                                    </View> : null}
                                    {orderInfo.num ? <View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>数量：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.num}</Text>
                                    </View> : null}
                                    {orderInfo.volume ? <View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>体积：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.volume}m³</Text>
                                    </View> : null}
                                    {orderInfo.cate ? <View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>货物类型：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.cate}</Text>
                                    </View> : null}
                                    {1 > 2 && orderInfo.carVisible &&<View style={styles.orderCargoInfoCon}>
                                        <Text style={styles.orderCargoInfoConText}>代取/送服务车型：</Text>
                                        <Text style={styles.orderCargoInfoConText}>{orderInfo.serviceCar}</Text>
                                    </View>}
                                </View>
                            </View>
                        </View>

                        <View style={[styles.containerItemView, styles.orderGoodsPicItemView]}>
                            <View style={styles.orderInfoItemView}>
                                <Text style={styles.orderCompanyInfoTitle}>物品图品</Text>
                            </View>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={[styles.orderGoodsPicView]}>
                                {this.renderGoodsPic(orderInfo.images)}
                            </View>
                        </View>
                        {this.renderPayment(orderInfo)}
                        <View style={[styles.containerItemView, styles.orderMoneyInfoView]}>
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>订单总价：</Text>
                                <Text style={styles.orderMoneyInfoCon}>¥ {parseFloat(orderInfo.price).toFixed(2)}</Text>
                            </View>
                            {orderInfo.deliveryFee.map((obj, index) => {
                                if (obj.is_selected !== 1) {
                                    obj.value = 0;
                                }
                                return (
                                    <View style={styles.orderMoneyInfoItem} key={index}>
                                        <Text style={styles.orderMoneyInfoTitle}>小件{obj.name}：</Text>
                                        <Text style={styles.orderMoneyInfoCon}>¥ {parseFloat(obj.value).toFixed(2)}</Text>
                                    </View>
                                );
                            })}

                            {orderInfo.premiums !== '0.00' && <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>运输保险费：</Text>
                                <Text style={styles.orderMoneyInfoCon}>¥ {orderInfo.premiums}</Text>
                            </View>}

                            {orderInfo.coupon > 0 && <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>优惠券：</Text>
                                <Text style={styles.orderMoneyInfoCon}>¥ -{parseFloat(orderInfo.coupon).toFixed(2)}</Text>
                            </View>}
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <View style={styles.orderMoneyInfoItem}>
                                <Text style={styles.orderMoneyInfoTitle}>实付金额：</Text>
                                <Text style={styles.orderMoneyInfoConNum}>¥ {paymentType === 3 ? 0 : parseFloat(orderInfo.relprice).toFixed(2)}</Text>
                            </View>
                        </View>
                    </ScrollView>
                    : <ActivityIndicatorItem />
                }
                {ready && this.renderOrderButton(orderInfo)}

                {modalVisiable &&
                    <Modal
                        visible={modalVisiable}
                        transparent={true}
                        onRequestClose={()=> {
                           this.updateState({
                               modalVisiable: false,
                           });
                       }}
                    >
                        <ImageViewer
                            imageUrls={images}
                             failImageSource={{
                                url: GlobalStyles.noPicture,
                                width: GlobalStyles.width,
                                height: GlobalStyles.width,
                            }}
                            saveToLocalByLongPress = {false}
                            index={imageIndex}
                            onClick = {() => {
                                this.updateState({
                                    modalVisiable: false,
                                });
                            }}
                        />
                    </Modal>
                }
                {showPayModal &&
                    <ModalView
                        show = {showPayModal}
                        title = {PAY_MODAL_CONFIG.title}
                        contentText = {PAY_MODAL_CONFIG.modalText}
                        cancelBtnName = {PAY_MODAL_CONFIG.cancelBtnName}
                        confirmBtnName = {PAY_MODAL_CONFIG.confirmBtnName}
                        cancelFoo = {() => this.showPayModal()}
                        confirmFoo = {() => this.submitPayment(orderInfo.id)}
                    />
                }
                {showCancelModal &&
                    <ModalView
                        show = {showCancelModal}
                        title = {CANCEL_MODAL_CONFIG.title}
                        contentText = {CANCEL_MODAL_CONFIG.modalText}
                        cancelBtnName = {CANCEL_MODAL_CONFIG.cancelBtnName}
                        confirmBtnName = {CANCEL_MODAL_CONFIG.confirmBtnName}
                        cancelFoo = {() => this.showCancelModal()}
                        confirmFoo = {() => this.cancelOrder(orderInfo.id)}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    scrollViewContainer: {
        marginBottom: 60,
    },
    noMarginBottom: {
        marginBottom: 0,
    },
    containerItemView: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    addressInfoView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressLeftView: {
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeViewIcon: {
        marginRight: 0,
        marginVertical: 20,
    },
    verLine: {
        height: 40,
    },
    horLine: {
        marginVertical: 10,
    },
    addressRightView: {
        flex: 1,
    },
    addressDetailView: {
        height: 60,
    },
    addressDetailItemView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    addressUserInfo: {
        fontSize: 18,
        color: '#333',
    },
    addressUserName: {
        fontSize: 16,
    },
    addressUserPhone: {
        fontSize: 14,
        color: '#555',
    },
    addressDetailConTitle: {
        width: 75,
        fontSize: 14,
        color: '#555',
    },
    addressDetailCon: {
        flex: 1,
        fontSize: 14,
        color: '#555',
    },
    addressDetailRight: {
        width: 80,
        alignItems: 'center',
    },
    addressDetailRightCon: {
        fontSize: 16,
        color: GlobalStyles.themeColor,
    },
    orderInfoItemView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    OrderInfoImage: {
        width: GlobalStyles.width * 0.2,
        height: 80,
        marginRight: 15,
        resizeMode: 'cover',
    },
    orderCompanyInfo: {
        flex: 1,
        // height: 80,
        justifyContent: 'space-around',
    },
    orderCompanyInfoItem: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderStatusView: {
        justifyContent: 'space-between',
    },
    orderCompanyInfoTitle: {
        fontSize: 15,
        color: '#333',
    },
    orderCompanyInfoCon: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        // backgroundColor: '#123'
    },
    orderStatus: {
        fontSize: 18,
        textAlign: 'right',
        color: GlobalStyles.themeColor,
    },
    orderCargoInfoView: {},
    orderCargoInfoItem: {
        flex: 1,
        // backgroundColor: '#123',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderCargoInfoCon: {
        flexDirection: 'row',
        alignItems: 'center',
        width: GlobalStyles.width > 330 ? (GlobalStyles.width - 80) / 2 : GlobalStyles.width,
    },
    orderCargoInfoConText: {
        // flex: 1,
        fontSize: 13,
        color: '#666',
        lineHeight: 25,
    },
    orderMoneyInfoItem: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    orderMoneyInfoTitle: {
        color: '#555',
    },
    orderMoneyInfoCon: {
        color: '#555',
    },
    orderMoneyInfoConNum: {
        fontSize: 16,
        color: '#f60',
    },
    orderDetailBtnItem: {},
    orderDetailBtnName: {},
    orderDetailBtnView: {
        height: 60,
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#dfdfdf',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    orderDetailBtnItem: {
        height: 35,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: '#555',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: GlobalStyles.bgColor,
    },
    orderDetailBtnName: {
        fontSize: 14,
        color: '#555',
    },

    orderItemBtnView: {
        height: 50,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btnItemView: {
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: '#777',
    },
    btnItemViewCur: {
        borderColor: GlobalStyles.themeColor,
    },
    btnItemName: {
        color: '#555',
        fontSize: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    btnItemNameCur: {
        color: GlobalStyles.themeColor,
    },

    chargePayTypeView: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    viewTitle: {
        height: 30,
        fontSize: 15,
        color: '#333',
    },
    chargeTypeItem: {
        marginTop: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    chargeTypeTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitleIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'contain',
    },
    orderGoodsPicItemView: {},
    orderGoodsPicView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginLeft: -10,
        justifyContent: 'flex-start'
    },
    orderGoodsPic: {
        width: (GlobalStyles.width - 55) / 3,
        height: (GlobalStyles.width - 100) / 3,
        marginLeft: 10,
    },
});
