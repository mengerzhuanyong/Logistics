/**
 * 速芽物流用户端 - MineCouponItem
 * https://menger.me
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

const newCouponBg = GlobalIcons.images_coupon_nouse;
const oldCouponBg = GlobalIcons.images_coupon_used;


export default class MineCouponItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            cid: this.props.cid,
            item: this.props.item,
            PAGE_FLAG: this.props.PAGE_FLAG,
            orderPrice: this.props.orderPrice,
            updateContent: this.props.updateContent,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        cid: '',
        item: {},
        PAGE_FLAG: '',
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

    render(){
        const { item, PAGE_FLAG, updateContent, orderPrice } = this.state;
        return (
            <TouchableOpacity
                style = {styles.container}
                activeOpacity = {PAGE_FLAG == "FLOW" ? 0.5 : 1}
                onPress = {() => {
                    let orderPrices = parseInt(orderPrice);
                    let couponFullPrice = parseInt(item.full);
                    if (PAGE_FLAG == 'FLOW') {
                        if (orderPrices >= couponFullPrice) {
                            // if (this.state.cid === '') {
                                updateContent('couponInfo', item);
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