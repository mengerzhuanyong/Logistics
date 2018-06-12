/**
 * 速芽物流用户端 - BusinessDetail
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Linking,
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
import BusinessItem from '../../component/common/businessItem'
import BusinessServicesItem from '../../component/business/businessServicesItem'
import BusinessCommentItem from '../../component/business/businessCommentItem'
import BannerView from '../../component/common/Banner'
import ShopRankView from '../../component/common/shopRankView'
import ShopTagsView from '../../component/common/shopTagsView'
import EmptyComponent from '../../component/common/EmptyComponent'

import ShopData from '../../asset/json/homeBusiness.json'

const collectIcon = GlobalIcons.icon_collect_white;
const collectedIcon = GlobalIcons.icon_collected;

export default class BusinessDetail extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        // console.log(params);
        this.state =  {
            uid: global.user.userData.uid,
            service: [],
            start: params.start != '' ? params.start : '',
            end: params.end != '' ? params.end : '',
            item: params.item != '' ? params.item : '',
            disinfo: params.disinfo != '' ? params.disinfo : '',
            ready: false,
            loading: false,
            loadMore: false,
            refreshing: false,
            showFoot: 0,
            error: false,
            errorInfo: "",
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        item: '',
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
        let { item, start, end } = this.state;
        let url = NetApi.businessService;
         // + '/sid/' + item.id + '/start/' + start + '/end/' + end + '/page/' + page;
        let data = {
            sid: item.id,
            start: start,
            end: end,
            page: page,
        };
        return this.netRequest.fetchPost(url, data)
        // return this.netRequest.fetchGet(url)
            .then( result => {
                // console.log('服务列表', result);
                return result;
            })
            .catch( error => {
                // console.log('服务列表', error);
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
        // console.log('页面总数1---', this.totalPage);
        this.totalPage = result.data.pageSize;
        // // console.log(result);
        let foot = 0;
        if (this.page >= this.totalPage) {
            // console.log('页面总数2---', this.totalPage);
            foot = 1; //listView底部显示没有更多数据了
        }
        this.updateState({
            showFoot: foot,
            service: this.state.service.concat(result.data.service)
        }, () => {
            // console.log('222', this.state.service);
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
                service: result.data.service
            });
        } else {
            toastShort(result.msg);
        }
    }

    onSubmitSearch = () => {
        this.freshNetData();
    }

    onPushToFlow = (item) => {
        item = item.item;
        const { navigate } = this.props.navigation;
        // console.log(item)
        navigate('Flow', {
            sid: this.state.item.id,
            item: item,
            pageTitle: 'pageTitle',
            reloadData: () => this.loadNetData(),
        });
    }

    renderCompanyItem = (item) => {
        // console.log(item);
        return (
            <BusinessServicesItem
                item = {item}
                onPushToFlow = {() => this.onPushToFlow(item)}
            />
        )
    }

    renderServiceEmptyView = () => {
        return <EmptyComponent emptyTips = {'暂未找到相关服务'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    renderServicesHeaderView = () => {
        const { loading, ready, refreshing, disinfo, isCollect, service } = this.state;
        return (
            <View style={styles.searchView}>
                <View style={styles.searchTitleView}>
                    <Text style={styles.searchTitle}>所有线路搜索</Text>
                    <Text style={styles.searchTitleConTips}>优惠信息：{disinfo}</Text>
                </View>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
                <View style={styles.searchContentView}>
                    <View style={styles.searchInputView}>
                        <View style={styles.searchInputItemView}>
                            <View style={[styles.searchItemIcon, styles.searchStartIcon]} />
                            <TextInput
                                style = {styles.searchInputItem}
                                placeholder = "发货地(城市名称)"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        start: text
                                    })
                                }}
                            />
                        </View>
                        <View style={[GlobalStyles.horLine, styles.searchHorLine]} />
                        <View style={styles.searchInputItemView}>
                            <View style={[styles.searchItemIcon, styles.searchEndIcon]} />
                            <TextInput
                                style = {styles.searchInputItem}
                                placeholder = "目的地(城市名称)"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        end: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style = {styles.searchBtnView}
                        onPress = {() => this.freshNetData()}
                    >
                        <Text style={styles.searchBtnItem}>确认</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render(){
        const { loading, ready, refreshing, businessInfo, isCollect, service } = this.state;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'所有路线'}
                    // style = {styles.navigationBar}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {this.renderServicesHeaderView()}
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {service}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderCompanyItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent = {this.renderServicesHeaderView}
                        ListFooterComponent = {this.renderServicesFooterView}
                        ListEmptyComponent = {this.renderServiceEmptyView}
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
        // marginBottom: 60,
        backgroundColor: GlobalStyles.bgColor,
        // backgroundColor: '#123',
    },
    scrollContainer: {
        marginTop: 10,
    },
    navigationBar: {
        zIndex: 2,
        backgroundColor: 'transparent',
    },
    horLine: {
        marginVertical: 10,
    },
    searchHorLine: {
        width: 20,
        marginHorizontal: 10,
        backgroundColor: '#555',
    },
    searchView: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    searchTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchTitle: {
        fontSize: 15,
        color: '#555',
    },
    searchTitleConTips: {
        fontSize: 15,
        color: GlobalStyles.themeColor,
    },
    searchContentView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: GlobalStyles.width - 130,
    },
    searchInputItemView: {
        width: (GlobalStyles.width - 130) / 2,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#123',
    },
    searchItemIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    searchStartIcon: {
        backgroundColor: GlobalStyles.themeColor,
    },
    searchEndIcon: {
        backgroundColor: '#f60',
    },
    searchInputItem: {
        height: 45,
        fontSize: 14,
        width: (GlobalStyles.width - 160) / 2,
    },
    searchBtnView: {
        width: 50,
        height: 60,
        alignItems: 'flex-end',
        justifyContent: 'center',
        // backgroundColor: '#f60',
    },
    searchBtnItem: {
        color: '#666',
        fontSize: 16,
    },
});
