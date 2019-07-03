/**
 * 速芽物流用户端 - MineCouponItem
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import { toastShort, consoleLog } from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import ActionSheet from 'react-native-actionsheet'

const newCouponBg = GlobalIcons.images_coupon_nouse;
const oldCouponBg = GlobalIcons.images_coupon_used;

const ACTION_CONFIG = {
    CANCEL_INDEX: 0,
    DESTRUCTIVE_INDEX: 1,
    options: ['取消', '确定'],
    title: '您确定要删除该优惠券吗？',
};

export default class MineCouponItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            cid: this.props.cid,
            item: this.props.item,
            PAGE_FLAG: this.props.PAGE_FLAG,
            PAGE_FLAG_TYPE: this.props.PAGE_FLAG_TYPE,
            orderPrice: this.props.orderPrice,
            updateContent: this.props.updateContent,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        cid: '',
        item: {},
        PAGE_FLAG: '',
        canDelete: false,
        PAGE_FLAG_TYPE: '',
        orderPrice: '',
        updateContent: () => {}
    }

    componentDidMount() {
        // console.log("接受参数", this.props);
    }

    updateState = (state) => {
        if (!this) { return };
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    deleteCouponItem = async (item, index) => {
        if (index === 1) {
            let url = NetApi.deleteCoupon;
            let data = {
                id: item.id,
                uid: this.props.uid,
            };
            let result = await this.netRequest.fetchPost(url, data, true);
            toastShort(result.msg);
            if (result.code === 1) {
                this.props.freshNetData && this.props.freshNetData();
            }
        }
    };

    showActionSheet() {
        this.ActionSheet.show()
    }

    render(){
        const { item, PAGE_FLAG, PAGE_FLAG_TYPE, updateContent, orderPrice } = this.state;
        let {onLongPress, canDelete} = this.props;
        return (
            <TouchableOpacity
                style = {styles.container}
                onPress = {() => {
                    let orderPrices = parseInt(orderPrice);
                    let couponFullPrice = parseInt(item.full);
                    if (PAGE_FLAG == 'FLOW') {
                        if (orderPrices >= couponFullPrice) {
                            // if (this.state.cid === '') {
                                updateContent('couponInfo', item, PAGE_FLAG_TYPE);
                                this.props.navigation.goBack();
                            // } else {
                            //     toastShort('当前已选择该优惠券，请选择其他或者直接返回');
                            // }
                            // console.log(orderPrices, couponFullPrice);
                            
                        } else {
                            let tips = "订单不满" + item.full + '元，无法使用该优惠券！';
                            toastShort(tips);
                        }
                    }
                }}
                // onLongPress={() => this.props.onLongPress()}
                onLongPress={() => canDelete && this.showActionSheet()}
            >
                <Image source={item.isuse == 0 ? newCouponBg : oldCouponBg} style={styles.couponBackgroundImg} />
                <View style={[styles.couponInfoItemView, styles.couponInfoTopView]}>
                    <Text style={styles.couponInfoName}>优惠券</Text>
                    <Text style={styles.couponInfoMoneyInfo}>¥ <Text style={styles.couponInfoMoneyCon}>{parseFloat(item.reduce).toFixed(2)}</Text></Text>
                </View>
                <View style={[styles.couponInfoItemView, styles.couponInfoBottomView]}>
                    <Text style={styles.couponInfoDetail}>订单满<Text style={styles.couponFullPrice}>{parseFloat(item.full).toFixed(2)}</Text>元使用</Text>
                    <Text style={styles.couponInfoDetail}>有效期至{item.time}</Text>
                </View>
                <View style = {styles.wrapper}>
                    <ActionSheet
                        ref = {o => this.ActionSheet = o}
                        title = {ACTION_CONFIG.title}
                        options = {ACTION_CONFIG.options}
                        cancelButtonIndex = {ACTION_CONFIG.CANCEL_INDEX}
                        destructiveButtonIndex = {ACTION_CONFIG.DESTRUCTIVE_INDEX}
                        onPress = {(index) => this.deleteCouponItem(item, index)}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 15,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        width: GlobalStyles.width - 30,
    },
    couponBackgroundImg: {
        height: 120,
        top: 0,
        resizeMode: 'cover',
        position: 'absolute',
        borderRadius: 5,
        width: GlobalStyles.width - 30,
    },
    navigationItemView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (GlobalStyles.width - 30) / 4,
    },
    couponInfoItemView: {
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    couponInfoTopView: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: '#123',
    },
    couponInfoName: {
        color: '#fff',
        fontSize: 15,
    },
    couponInfoMoneyInfo: {
        fontSize: 13,
        color: '#fff',
    },
    couponFullPrice: {
        fontSize: 16,
        color: GlobalStyles.themeColor,
        marginHorizontal: 5,
    },
    couponInfoMoneyCon: {
        fontSize: 18,
    },
    couponInfoBottomView: {
        height: 70,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    couponInfoDetail: {
        color: '#777',
        marginRight: 10,
        lineHeight: 25,
    },
});