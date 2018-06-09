/**
 * 速芽物流用户端 - MineCoupon
 * https://menger.me
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
import BusinessItem from '../../component/common/businessItem'
import EmptyComponent from '../../component/common/EmptyComponent'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineCoupon extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            uid: global.user ? global.user.userData.uid : '',
            ready: false,
            showFoot: 0,
            loadMore: false,
            error: false,
            errorInfo: "",
            refreshing: false,
            collectListData: [],
            canBack: false,
        }
        this.netRequest = new NetRequest();
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
        this.props.navigation.state.params.reloadData();
        this.props.navigation.goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = (page) => {
        let url = NetApi.mineCollect + this.state.uid + '/page/' + page;
        this.netRequest.fetchGet(url)
        return this.netRequest.fetchGet(url)
            .then( result => {
                // console.log('服务列表', result);
                return result;
            })
            .catch( error => {
                // console.log('服务列表', error);
                this.updateState({
                    ready: true,
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
            collectListData: this.state.collectListData.concat(result.data.store)
            // collectListData: []
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
                collectListData: result.data.store
            })
        }
    }

    onSubmitSearch = async () => {
        let result = await this.loadNetData(0);
        // // console.log(result);
        if (result && result.code == 1) {
            this.page = 0;
            this.updateState({
                showFoot: 0
            })
            toastShort(result.msg);
            this.updateState({
                collectListData: result.data.store
            })
        } else {
            toastShort(result.msg);
        }
    }

    onPushToBusiness = (item) => {
        item = item.item;
        const { navigate } = this.props.navigation;
        navigate('BusinessDetail', {
            webTitle: 'webTitle',
            item: item,
            reloadData: () => this.freshNetData(),
        })
    }

    renderListItem = (item) => {
        return (
            <BusinessItem
                item = {item}
                {...this.props}
                onPushToBusiness = {()=> this.onPushToBusiness(item)}
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
        return <EmptyComponent emptyTips={'对不起，您还没有收藏商家'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    render(){
        const { ready, refreshing, collectListData } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'我的收藏'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {ready ?
                    <FlatList
                        style = {styles.flatListView}
                        keyExtractor = { item => item.id}
                        data = {collectListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderListItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
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
    flatListView: {
        backgroundColor: 'transparent'
    },
    emptyTipsView: {
        alignItems: 'center',
    },
    emptyTipsCon: {
        fontSize: 16,
        color: '#666',
        lineHeight: 30,
    },
    emptyTipsBtnCon: {

    }
});
