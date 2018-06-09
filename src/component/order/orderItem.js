/**
 * 速芽物流用户端 - OrderItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar, DefaultTabBar} from 'react-native-scrollable-tab-view'
import ActionSheet from 'react-native-actionsheet'
import NetRequest from '../../util/utilsRequest'
import ModalView from '../../util/utilsDialogs'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import {toastShort, consoleLog} from '../../util/utilsToast'

const ACTION_CONFIG = {
    CANCEL_INDEX: 0,
    DESTRUCTIVE_INDEX: 1,
    options: ['取消', '确定'],
    title: '您确定要取消该订单吗？',
};
const CANCEL_MODAL_CONFIG = {
    title: '取消订单',
    modalText: '您确认要取消该订单吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};

export default class OrderItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCancelModal: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        this.loadNetData();
    }

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = () => {
        // console.log(this.props.item)
    };

    onPushToNextPage = (component, item) => {
        const {navigate} = this.props.navigation;
        navigate(component, {
            item: item,
            orderid: item.id,
            webTitle: 'webTitle',
            PAGE_FLAG: 'OrderList',
            reloadData: () => this.props.reloadData(),
        })
    };

    cancelOrder = () => {
        this.showCancelModal();
        let {item} = this.props;
        let url = NetApi.orderCancel + item.id;
        this.netRequest.fetchGet(url)
            .then(result => {
                    // console.log(result);
                if (result && result.code == 1) {
                    toastShort(result.msg);
                    this.props.reloadData();
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                console.log(error);
                toastShort('error');
            })
    };

    goToPayOrder = (orderid) => {
        Alert.alert('立即付款');
    };

    showActionSheet() {
        this.ActionSheet.show()
    }

    showCancelModal = () => {
        this.updateState({
            showCancelModal: !this.state.showCancelModal
        })
    };

    // 0 未付款、 1 待接单、 2 进行中、 3 待评价、 4 已完成、 5 退款/售后 6
    renderOrderBtn = (item) => {
        status = parseInt(item.status);
        let btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}/>;
        switch (status) {
            // 未付款
            case 0:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={styles.btnItemView}
                        onPress={() => this.showCancelModal(item.id)}
                    >
                        <Text style={styles.btnItemName}>取消订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>立即付款</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 待接单
            case 1:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={styles.btnItemView}
                        onPress={() => this.showCancelModal(item.id)}
                    >
                        <Text style={styles.btnItemName}>取消订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 运输中
            case 2:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 待评价
            case 3:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={styles.btnItemView}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={styles.btnItemName}>查看详情</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderComment', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>立即评价</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 已完成
            case 4:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 退款申请中
            case 5:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 退款成功
            case 6:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 等待取货
            case 7:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={styles.btnItemView}
                        onPress={() => this.showCancelModal(item.id)}
                    >
                        <Text style={styles.btnItemName}>取消订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
            // 待收货
            case 8:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
            default:
                btnItem = <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                    <TouchableOpacity
                        style={[styles.btnItemView, styles.btnItemViewCur]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Text style={[styles.btnItemName, styles.btnItemNameCur]}>查看详情</Text>
                    </TouchableOpacity>
                </View>;
                break;
        }
        return btnItem;
    };

    render() {
        // 0 未付款、 1 待接单、 2 进行中、 3 待评价、 4 已完成、 5 退款/售后
        const {item} = this.props;
        let {showCancelModal} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.orderItemView}>
                    <View style={[styles.orderItemInfo, styles.orderItemTitle]}>
                        <Text style={styles.orderItemInfoCompany}>申通物流</Text>
                        <Text style={styles.orderItemInfoStatus}>{item.statusName}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}>
                        <Text style={[GlobalStyles.horLine, styles.horLineCon]}></Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.orderItemInfo, styles.orderDetailView]}
                        onPress={() => this.onPushToNextPage('OrderDetail', item)}
                    >
                        <Image source={item.img != '' ? {uri: item.img1} : GlobalIcons.banner1}
                               style={styles.orderGoodsPic}/>
                        <View style={styles.orderGoodsInfo}>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsTitle}>收货人：{item.receiver}</Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsLeftView}>路线：<Text
                                    style={styles.orderGoodsLeftViewCon}>{item.service}</Text></Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsLeftView}>班次：<Text
                                    style={styles.orderGoodsLeftViewCon}>{item.time}</Text></Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsLeftView}>订单价格：</Text>
                                <Text
                                    style={[styles.orderGoodsRightView, styles.orderDetailPrices]}>¥ {parseFloat(item.price).toFixed(2)}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={[GlobalStyles.horLine, styles.horLine]}>
                        <Text style={[GlobalStyles.horLine, styles.horLineCon]}></Text>
                    </View>
                    {this.renderOrderBtn(item)}
                </View>
                <View style={styles.wrapper}>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={ACTION_CONFIG.title}
                        options={ACTION_CONFIG.options}
                        cancelButtonIndex={ACTION_CONFIG.CANCEL_INDEX}
                        destructiveButtonIndex={ACTION_CONFIG.DESTRUCTIVE_INDEX}
                        onPress={this.cancelOrder}
                    />
                    {showCancelModal && 
                        <ModalView
                            show = {showCancelModal}
                            title = {CANCEL_MODAL_CONFIG.title}
                            contentText = {CANCEL_MODAL_CONFIG.modalText}
                            cancelBtnName = {CANCEL_MODAL_CONFIG.cancelBtnName}
                            confirmBtnName = {CANCEL_MODAL_CONFIG.confirmBtnName}
                            cancelFoo = {() => this.showCancelModal()}
                            confirmFoo = {() => this.cancelOrder(item.id)}
                        />
                    }
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
    orderItemView: {
        padding: 15,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    orderItemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderItemTitle: {
        height: 40,
        alignItems: 'center',
    },
    orderItemInfoCompany: {
        fontSize: 14,
        color: '#333',
    },
    orderItemInfoStatus: {
        fontSize: 13,
        color: GlobalStyles.themeColor,
    },
    orderDetailView: {
        paddingVertical: 15,
        position: 'relative',
        justifyContent: 'space-between',
    },
    orderGoodsPic: {
        width: 100,
        height: 80,
        resizeMode: 'cover'
    },
    orderGoodsInfo: {
        // width: GlobalStyles.width - 100,
        flex: 1,
        marginLeft: 10,
    },
    orderInfoItem: {
        marginVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderGoodsTitle: {
        fontSize: 17,
        color: '#333',
    },
    orderGoodsLeftView: {
        fontSize: 13,
        color: '#555',
    },
    orderGoodsLeftViewCon: {
        fontSize: 13,
        color: '#555',
    },
    orderGoodsRightView: {
        fontSize: 13,
        color: '#555',
    },
    orderDetailPrices: {
        fontSize: 16,
        color: '#f60',
    },
    orderItemBtnView: {
        height: 40,
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
});