/**
 * 速芽物流用户端 - MineCoupon
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    FlatList,
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
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import MineCouponItem from '../../component/mine/mineCouponItem'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineCoupon extends Component {

    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state;
        // console.log(params);
        this.state =  {
            uid: global.user.userData.uid,
            ready: false,
            showFoot: 0,
            loadMore: false,
            error: false,
            errorInfo: "",
            refreshing: false,
            couponListData: [],
            cid: params.cid != '' ? params.cid : '',
            orderPrice: params.orderPrice != '' ? params.orderPrice : '',
            PAGE_FLAG: params.PAGE_FLAG != '' ? params.PAGE_FLAG : '',
            PAGE_FLAG_TYPE: params.PAGE_FLAG_TYPE != '' ? params.PAGE_FLAG_TYPE : '',
            updateContent: params.updateContent ? params.updateContent : () => {},
            // couponListData: ShopData.data,
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        user: {
            uid: 1,
        }
    }

    /**
     * 初始化状态
     * @type {Boolean}
     */
    page = -1;
    totalPage = 0;
    loadMore = false;
    refreshing = false;

    async componentDidMount(){
        // this.getNavigations();
        
        if (global.user) {
            this.updateState({
                uid: global.user.userData.uid
            });
        }
        await this.dropLoadMore();
        this.updateState({
            ready: true,
            showFoot: 0 // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        });
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
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

    loadNetData = (page) => {
        let { uid } = this.state;
        let url = NetApi.mineCouponList + uid + '/style/1/page/' + page;
        return this.netRequest.fetchGet(url)
            .then( result => {
                // console.log('优惠券信息', result);
                return result;
            })
            .catch( error => {
                // console.log('优惠券信息', error);
                this.updateState({
                    error: true,
                    errorInfo: error
                })
            })
    }

    dropLoadMore = async () => {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot != 0) {
            return;
        }
        if ((this.page != 1) && (this.page >= this.totalPage)) {
            return;
        } else {
            this.page++;
        }
        this.updateState({
            showFoot: 2
        })
        let result = await this.loadNetData(this.page);
        // console.log(this.totalPage);
        this.totalPage = result.data.pageSize;
        // // console.log(result);
        let foot = 0;
        if (this.page >= this.totalPage) {
            // console.log(this.totalPage);
            foot = 1; //listView底部显示没有更多数据了
        }
        this.updateState({
            showFoot: foot,
            couponListData: this.state.couponListData.concat(result.data.coupon)
            // couponListData: []
        })
    }

    freshNetData = async () => {

        let result = await this.loadNetData(0);
        if (result && result.code == 1) {
            this.page = 0;
            this.updateState({
                showFoot: 0
            })
            // // console.log(result);
            this.updateState({
                couponListData: result.data.coupon
            })
        }
    }

    renderListItem = (item) => {
        return (
            <MineCouponItem
                cid = {this.state.cid}
                item = {item.item}
                {...this.props}
                orderPrice = {this.state.orderPrice}
                PAGE_FLAG = {this.state.PAGE_FLAG}
                PAGE_FLAG_TYPE = {this.state.PAGE_FLAG_TYPE}
                updateContent = {this.state.updateContent}
            />
        )
    }
    renderHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
                <Text style={styles.titleName}>推荐</Text>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
            </View>
        )
    }
    renderFooterView = () => {
        return this.state.loadMore && <ActivityIndicatorItem />;
    }
    renderEmptyView = () => {
        return (
            <View style={styles.emptyTipsView}>
                <Text style={styles.emptyTipsCon}>您还没有优惠券呢～</Text>
                <TouchableOpacity
                    style = {styles.emptyTipsBtnCon}
                    onPress = {() => this.onPushToNextPage('MineCouponUsed', 2)}
                >
                    <Text style={styles.emptyTipsCon}>已使用/过期的优惠券></Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    onPushToNextPage = (component, status) => {
        const { navigate } = this.props.navigation;
        navigate(component, {
            status: status,
            pageTitle: 'pageTitle',
            reloadData: () => this.loadNetData(),
        })
    }

    renderRightButton = () => {
        return (
            <TouchableOpacity
                style = {GlobalStyles.rightButton}
                onPress = {() => this.onPushToNextPage('MineCouponUsed', 2)}
            >
                <Text style={[GlobalStyles.rightButtonName, styles.rightButtonName]}>已使用 / 已过期</Text>
            </TouchableOpacity>
        )
    }

    render(){
        const { ready, refreshing, couponListData } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'我的优惠券'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    rightButton = {this.renderRightButton()}
                />
                {ready ?
                    <FlatList
                        style = {styles.flatListView}
                        keyExtractor = { item => item.id}
                        data = {couponListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderListItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        // ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent = {this.renderHeaderView}
                        ListFooterComponent = {this.renderFooterView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
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
    rightButtonName: {
        fontSize: 13,
    },
    flatListView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    emptyTipsView: {
        alignItems: 'center',
    },
    emptyTipsCon: {
        fontSize: 14,
        color: '#666',
        lineHeight: 30,
    },
    emptyTipsBtnCon: {

    }
});
