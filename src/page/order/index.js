/**
 * 速芽物流用户端 - Order
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import FooterComponent from '../../component/common/footerComponent'
import EmptyComponent from '../../component/common/EmptyComponent'

import OrderItemView from '../../component/order/orderItem'

import NavigationsData from '../../asset/json/systemNavigations.json'

export default class Order extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            user: global.user ? global.user.userData : '',
            navigations: [],
            activeTabIndex: params ? params.activeTabIndex : 0,
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.getNavigations();
        this.loadNetData();
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

    loadNetData = () => {
        if (global.user.loginState) {
            this.updateState({
                user: global.user.userData,
            });
        }
    }

    getNavigations = () => {
        let url = NetApi.navigations;
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code == 1) {
                    this.updateState({
                        navigations: result.data.orderNavigations
                    })
                }
                // console.log('首页推荐', result);
            })
            .catch( error => {
                // console.log('首页推荐', error);
            })
    }

    renderOrderTabBar = (data) => {
        if (!data && data.length <= 0) {
            return;
        }
        let orderTabBar = data.map((obj, index) => {
            if (!obj) {
                return;
            }
            return (
                <OrderDetailTab
                    uid = {this.state.user.uid}
                    key = {'orderTabBar' + obj.status}
                    status = {obj.status}
                    tabLabel = {obj.name}
                    {...this.props}
                />
            );
            
        });
        return orderTabBar;
    }


    render(){
        const { navigations, activeTabIndex } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'我的订单'}
                    // leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {navigations.length > 0 ?
                    <ScrollableTabView
                        initialPage={activeTabIndex}
                        tabBarInactiveTextColor = "#333"
                        onChangeTab = {this.getNavigations}
                        tabBarActiveTextColor = {GlobalStyles.themeColor}
                        tabBarUnderlineStyle = {GlobalStyles.tabBarUnderline}
                        renderTabBar = { () => <ScrollableTabBar/>}
                        style = {GlobalStyles.scrollTabBarNav}
                    >
                        {this.renderOrderTabBar(navigations)}
                    </ScrollableTabView>
                    : null
                }
            </View>
        );
    }
}

export class OrderDetailTab extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            uid: this.props.uid,
            ready: false,
            showFoot: 0,
            loadMore: false,
            error: false,
            errorInfo: "",
            refreshing: false,
            orderListData: [],
            status: this.props.status,
        }
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        uid: global.user ? global.user.userData.uid : '',
        status: 0,
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
        await this.dropLoadMore();
        this.updateState({
            ready: true,
            showFoot: 0 // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        })
    }

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    /**
     * @Author   Menger
     * @DateTime 2018-03-21
     * @param    {[type]}   status 0 未付款 1 待接单 2 运输中 3 待评价 4 已完成 5 退款申请中 6 退款成功 7 等待取货 8 待收货 9 已关闭
     * @param    {[type]}   page   [description]
     * @return   {[type]}          [description]
     */
    loadNetData = (status, page) => {
        // console.log(status, this.state.uid);
        let url = NetApi.orderList + status + '/uid/' + this.state.uid + '/page/' + page;
        return this.netRequest.fetchGet(url, true)
            .then(result => {
                // console.log('订单列表', result);
                return result;
            })
            .catch(error => {
                // console.log('首页推荐', error);
                this.updateState({
                    error: true,
                    errorInfo: error
                })
            })
    };

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
        });
        let result = await this.loadNetData(this.state.status, this.page);
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
            orderListData: this.state.orderListData.concat(result.data.order)
            // orderListData: []
        })
    };

    freshNetData = async () => {

        let result = await this.loadNetData(this.state.status, 0);
        if (result && result.code == 1) {
            this.page = 0;
            this.updateState({
                showFoot: 0
            });
            // // console.log(result);
            this.updateState({
                orderListData: result.data.order
            })
        }
    };

    onPushToOrderDetail = () => {
        const { navigate } = this.props.navigation;
        navigate('OrderDetail', {
            pageTitle: 'pageTitle',
            reloadData: () => this.freshNetData(),
        })
    }

    onPushToOrderComment = () => {
        const { navigate } = this.props.navigation;
        navigate('OrderComment', {
            pageTitle: 'pageTitle',
            reloadData: () => this.freshNetData(),
        })
    }

    renderCompanyItem = (item) => {
        return (
            <OrderItemView
                {...this.props}
                item = {item.item}
                uid = {1}
                reloadData = { () => this.freshNetData()}
            />
        )
    }

    renderHeaderView = () => {
        let { navigations } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.shopListViewTitle}>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <Text style={styles.titleName}>推荐</Text>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                </View>
            </View>
        )
    }

    renderFooterView = () => {
        return <FooterComponent status = {this.state.showFoot} />;
    }

    renderEmptyView = () => {
        return this.state.showFoot == 0 && <EmptyComponent emptyTips = {'您还没有相关订单'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    renderFlatlist = () => {
        const { ready, refreshing, orderListData } = this.state;
        return (
            <FlatList
                style = {styles.container}
                keyExtractor = { item => item.id}
                data = {orderListData}
                extraData = {this.state}
                renderItem = {(item) => this.renderCompanyItem(item)}
                onEndReachedThreshold = {0.2}
                onEndReached = {(info) => this.dropLoadMore(info)}
                onRefresh = {this.freshNetData}
                refreshing = {refreshing}
                ItemSeparatorComponent={this.renderSeparator}
                // ListHeaderComponent = {this.renderHeaderView}
                ListFooterComponent = {this.renderFooterView}
                ListEmptyComponent = {this.renderEmptyView}
            />
        )
    }

    render(){
        const { ready, refreshing, orderListData } = this.state;
        if (!ready && !this.state.error) {
            return (
                <View style={styles.container}>
                    <ActivityIndicatorItem />
                </View>
            );
        } else if (this.state.error) {
            return (
                <View style={styles.container}>
                    <Text>网络请求失败</Text>
                </View>
            );
        }
        return this.renderFlatlist();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
});