/**
 * 速芽物流用户端 - Home
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Linking,
    FlatList,
    Platform,
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
import FooterComponent from '../../component/common/footerComponent'
import EmptyComponent from '../../component/common/EmptyComponent'
import {Menu, Button} from 'teaset'

import BannerView from '../../component/common/Banner'
import HotNews from '../../component/common/HotNews'
import NavigatorItem from '../../component/home/navigatorItem'
import BusinessItem from '../../component/common/businessItem'
import NavigationsData from '../../asset/json/systemNavigations.json'

const isIos = Platform.OS === 'ios';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            ready: false,
            showFoot: 0,
            loadMore: false,
            error: false,
            errorInfo: "",
            refreshing: false,
            companyListData: [],
            navigations: NavigationsData.data.indexNavigations,
            bannerData: [],
            hotNewsData: [],
        }
        this.netRequest = new NetRequest();
        this.showSortMenu = this.showSortMenu.bind(this);
    }

    /**
     * 初始化状态
     * @type {Boolean}
     */
    page = -1;
    sortType = 1;
    totalPage = 0;
    loadMore = false;
    refreshing = false;

    async componentDidMount(){
        this.getNavigations();
        this.getBannerData();
        await this.dropLoadMore(1);
        this.updateState({
            ready: true,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        })
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

    getBannerData = () => {
        let url = NetApi.getBanner;
        this.netRequest.fetchGet(url)
            .then(result => {
                if (result && result.code == 1) {
                    this.updateState({
                        bannerData: result.data.banner,
                        hotNewsData: result.data.headlines,
                    });
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    };

    getNavigations = () => {
        let url = NetApi.navigations;
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code == 1) {
                    this.updateState({
                        navigations: result.data.indexNavigations
                    })
                }
            })
            .catch( error => {
            })
    };

    loadNetData = (sort, page) => {
        let url = NetApi.index + page + '/sort/' + sort;
        return this.netRequest.fetchGet(url)
            .then( result => {
                // // console.log(result);
                return result;
            })
            .catch( error => {
                this.updateState({
                    error: true,
                    errorInfo: error
                })
            })
    };

    dropLoadMore = async () => {
        // 如果是正在加载中或没有更多数据了，则返回
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
        let result = await this.loadNetData(this.sortType, this.page);
        this.totalPage = result.data.pageSize;
        let foot = 0;
        if (this.page >= this.totalPage) {
            foot = 1; // listView底部显示没有更多数据了
        }
        this.updateState({
            showFoot: foot,
            companyListData: this.state.companyListData.concat(result.data.store)
        })
    };

    /**
     * @Author   Menger
     * @DateTime 2018-03-17
     * @param    {int}   sort 1: 综合 2: 星级 3: 距离
     * @return   {[type]}        [description]
     */
    freshNetData = async (sort = `${this.sortType}`) => {

        let result = await this.loadNetData(sort, 0);
        if (result && result.code == 1) {
            this.page = 0;
            this.updateState({
                showFoot: 0
            })
            this.updateState({
                companyListData: result.data.store,
            })
        }
    };

    onPushToBusiness = (item) => {
        item = item.item;
        const { navigate } = this.props.navigation;
        navigate('BusinessDetail', {
            pageTitle: 'pageTitle',
            item: item,
            reloadData: () => this.freshNetData(1),
        })
    };

    onPushNavigator = (nav, compent) => {
        const { navigate } = this.props.navigation;
        navigate(compent, {
            navItem: nav,
            pageTitle: 'pageTitle',
            reloadData: () => this.freshNetData(1),
        })
    };

    renderCompanyItem = (item) => {
        return (
            <BusinessItem
                item = {item}
                {...this.props}
                onPushToBusiness = {()=> this.onPushToBusiness(item)}
            />
        )
    };

    showSortMenu = (align) => {
        this.menu.measure((x, y, width, height, pageX, pageY) => {
            let items = [
                {title: '综合排序', onPress: () => {this.freshNetData(1); this.sortType = 1}},
                {title: '星级排序', onPress: () => {this.freshNetData(2); this.sortType = 2}},
                {title: '距离排序', onPress: () => {this.freshNetData(3); this.sortType = 3}},
            ];
            Menu.show({x: pageX, y: pageY, width, height}, items, {align});
        });
    };

    renderHeaderView() {
        let { navigations, bannerData, hotNewsData } = this.state;
        return (
            <View style={styles.container} />
        )
    }

    renderFooterView = () => {
        return <FooterComponent status = {this.state.showFoot} />;
    }

    renderEmptyView = () => {
        return this.state.showFoot == 0 && <EmptyComponent emptyTips={'暂未找到相关信息'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    renderFlatlist = () => {
        const { ready, refreshing, companyListData } = this.state;
        return (
                <FlatList
                    style = {styles.shopListView}
                    keyExtractor = { item => item.id}
                    data = {companyListData}
                    extraData = {this.state}
                    // scrollEnabled = {false} // 禁止滑动
                    renderItem = {(item) => this.renderCompanyItem(item)}
                    onEndReachedThreshold = {2}
                    onEndReached = {(info) => this.dropLoadMore(info)}
                    onRefresh = {this.freshNetData}
                    refreshing = {refreshing}
                    ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent = {() => this.renderHeaderView()}
                    ListFooterComponent = {this.renderFooterView}
                    ListEmptyComponent = {this.renderEmptyView}
                />
        )
    }

    renderOrderList = () => {
        return (
            <View>
                <Text>最新订单</Text>
                <Text>11111</Text>
            </View>
        );
    }

    render(){
        let { navigations, bannerData, hotNewsData, ready, refreshing, companyListData } = this.state;
        if (isIos) {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.container}>
                        <NavigationBar
                            style = {{
                                height: 0,
                                backgroundColor: 'transparent'
                            }}
                        />
                        <BannerView bannerData = {bannerData} />
                        <View style={styles.homeNavigationView}>
                            <NavigatorItem
                                navigatorName = {navigations[0].name}
                                navigatorIcon = {GlobalIcons.icon_delivery_now}
                                onPushNavigator = {() => {
                                    this.onPushNavigator(navigations[0], 'BusinessList');
                                }}
                            />
                            <NavigatorItem
                                navigatorName = {navigations[1].name}
                                navigatorIcon = {GlobalIcons.icon_delivery_next}
                                onPushNavigator = {() => {
                                    this.onPushNavigator(navigations[1], 'BusinessList');
                                }}
                            />
                            <NavigatorItem
                                navigatorName = {navigations[2].name}
                                navigatorIcon = {GlobalIcons.icon_logistics}
                                onPushNavigator = {() => {
                                    this.onPushNavigator(navigations[2], 'BusinessList');
                                }}
                            />
                            <NavigatorItem
                                navigatorName = {navigations[3].name}
                                navigatorIcon = {GlobalIcons.icon_plane}
                                onPushNavigator = {() => {
                                    this.onPushNavigator(navigations[3], 'BusinessList');
                                }}
                            />
                        </View>
                        <HotNews hotNewsData = {hotNewsData} />
                        {1 > 2 &&this.renderOrderList()}
                        <View style={styles.shopListHeadView}>
                            <View style={styles.shopListViewTitle}>
                                <View style={[GlobalStyles.horLine, styles.horLine]} />
                                <Text style={styles.titleName}>推荐</Text>
                                <View style={[GlobalStyles.horLine, styles.horLine]} />
                            </View>
                            {1 > 2 && <TouchableOpacity style={GlobalStyles.sortBtnView} ref={(menu) => this.menu = menu} onPress={() => this.showSortMenu('end')}>
                                <Text style={GlobalStyles.sortBtnName}>排序</Text>
                            </TouchableOpacity>}
                        </View>
                        {ready ?
                            this.renderFlatlist()
                            : <ActivityIndicatorItem />
                        }
                    </ScrollView>
                </View>
            );
        } else {
            return (
                <ScrollView style={styles.container}>
                    <NavigationBar
                        style = {{
                            height: 0,
                            backgroundColor: 'transparent'
                        }}
                    />
                    <BannerView bannerData = {bannerData} />
                    <View style={styles.homeNavigationView}>
                        <NavigatorItem
                            navigatorName = {navigations[0].name}
                            navigatorIcon = {GlobalIcons.icon_delivery_now}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[0], 'BusinessList');
                            }}
                        />
                        <NavigatorItem
                            navigatorName = {navigations[1].name}
                            navigatorIcon = {GlobalIcons.icon_delivery_next}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[1], 'BusinessList');
                            }}
                        />
                        <NavigatorItem
                            navigatorName = {navigations[2].name}
                            navigatorIcon = {GlobalIcons.icon_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[2], 'BusinessList');
                            }}
                        />
                        <NavigatorItem
                            navigatorName = {navigations[3].name}
                            navigatorIcon = {GlobalIcons.icon_plane}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[3], 'BusinessList');
                            }}
                        />
                    </View>
                    <HotNews hotNewsData = {hotNewsData} />
                    {1 > 2 &&this.renderOrderList()}
                    <View style={styles.shopListHeadView}>
                        <View style={styles.shopListViewTitle}>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <Text style={styles.titleName}>推荐</Text>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                        </View>
                        {1 > 2 && <TouchableOpacity style={GlobalStyles.sortBtnView} ref={(menu) => this.menu = menu} onPress={() => this.showSortMenu('end')}>
                            <Text style={GlobalStyles.sortBtnName}>排序</Text>
                        </TouchableOpacity>}
                    </View>
                    {ready ?
                        this.renderFlatlist()
                        : <ActivityIndicatorItem />
                    }
                </ScrollView>
            );
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: GlobalStyles.height,
        backgroundColor: GlobalStyles.bgColor,
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeNavigationView: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    shopListView: {
        flex: 1,
        height: GlobalStyles.height - 100,
        backgroundColor: '#fff',
    },
    shopListHeadView: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: GlobalStyles.borderColor,
    },
    shopListViewTitle: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    horLine: {
        width: 20,
        backgroundColor: '#888',
    },
    titleName: {
        fontSize: 16,
        color: '#888',
        marginHorizontal: 20,
    },
    itemContainer: {
        height: 600,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    }
});
