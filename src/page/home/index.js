/**
 * 速芽物流用户端 - Home
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
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import JPushModule from 'jpush-react-native'
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
import {Geolocation} from 'react-native-baidu-map'
import {checkFloat} from '../../util/utilsRegularMatch'

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
            appkey: 'AppKey',
            imei: 'IMEI',
            package: 'PackageName',
            deviceId: 'DeviceId',
            version: 'Version',
            pushMsg: 'PushMessage',
            registrationId: 'registrationId',
            lng: '',
            lat: '',
            address: '当前位置',
            addressLine: 1,
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
        this.jpushRelative();
        this.getNavigations();
        this.getBannerData();
        this.getLocation();
        // await this.dropLoadMore();
        this.updateState({
            ready: true,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        })
    }

    jpushRelative = () => {
        JPushModule.addReceiveOpenNotificationListener(map => {
            // console.log('Opening notification!')
            // console.log('map.extra: ' + map.extras)
            this.jumpSecondActivity();
            isIos && this.setBadge();
            // JPushModule.jumpToPushActivity("SecondActivity");
        })
    }

    componentWillUnmount(){
        JPushModule.clearAllNotifications();
        this.timer && clearTimeout(this.timer);
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

    getLocation = () => {
        Geolocation.getCurrentPosition()
            .then(data => {
                // console.log(data);
                // console.log(checkFloat(35.95496));
                let location = checkFloat(data.latitude);
                if (location) {
                    this.setState({
                        lat: data.latitude,
                        lng: data.longitude,
                    });
                    this.postLocation(data.latitude, data.longitude);
                }
            })
            .catch(e => {
                console.log(e, '获取地理位置失败，请稍后重试！');
            })
    };

    setBadge = () => {
        JPushModule.setBadge(0, (badgeNumber) => {
            // console.log(badgeNumber);
            alert(badgeNumber);
        })
    }

    jumpSecondActivity = () => {
        // console.log('jump to SecondActivity');
        this.props.navigation.navigate('Mine');
    }

    postLocation = async (lat = this.state.lat, lng = this.state.lng) => {
        if (this.state.lat !== '') {
            lat = this.state.lat;
            lng = this.state.lng;
        }
        let url = NetApi.postLongitude;
        lng = lng < 0 ? -lng : lng;
        let data = {
            lat: lat,
            lng: lng,
        };
        // console.log('111111',lat, lng);
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log(result);
                this.dropLoadMore();
                this.updateState({
                    ready: true,
                    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
                    address: result.data.address,
                    addressLine: result.data.addressLine,
                })
            })
            .catch( error => {
                // console.log('网络请求失败', error);
            })
    }

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
                // console.log(error);
            })
    };

    loadNetData = (sort, page) => {
        let url = NetApi.index + page + '/sort/' + sort;
        return this.netRequest.fetchGet(url)
            .then( result => {
                console.log(result);
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
        this.updateState({
            ready: true,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        })
        // let result = await this.loadNetData(this.sortType, this.page);
        this.totalPage = result.data.pageSize;
        let foot = 0;
        if (this.page >= this.totalPage) {
            foot = 1; // listView底部显示没有更多数据了
        }
        if (result && result.code ==1) {
            this.updateState({
                showFoot: foot,
                companyListData: this.state.companyListData.concat(result.data.store)
            })
        } else {
            toastShort(result.msg);
            this.updateState({
                showFoot: foot,
                companyListData: this.state.companyListData
            })
        }
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
                showFoot: 0,
                companyListData: result.data.store,
            })
        } else {
            toastShort(result.msg);
            this.updateState({
                showFoot: 0,
                companyListData: this.state.companyListData
            })
        }
    };

    onPushToBusiness = (item) => {
        item = item.item;
        const { navigate } = this.props.navigation;
        navigate('BusinessDetail', {
            webTitle: 'webTitle',
            item: item,
            reloadData: () => this.freshNetData(1),
        })
    };

    onPushNavigator = (nav, compent) => {
        const { navigate } = this.props.navigation;
        navigate(compent, {
            navItem: nav,
            webTitle: 'webTitle',
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
            <View style={styles.container}>
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
                    {navigations.length >= 5 && <NavigatorItem
                        navigatorName = {navigations[4].name}
                        navigatorIcon = {GlobalIcons.icon_nav_world}
                        onPushNavigator = {() => {
                            this.onPushNavigator(navigations[4], 'BusinessList');
                        }}
                    />}
                    {navigations.length >= 6 && <NavigatorItem
                        navigatorName = {navigations[5].name}
                        navigatorIcon = {GlobalIcons.icon_nav_car}
                        onPushNavigator = {() => {
                            this.onPushNavigator(navigations[5], 'BusinessList');
                        }}
                    />}
                    {navigations.length >= 7 && <NavigatorItem
                        navigatorName = {navigations[6].name}
                        navigatorIcon = {GlobalIcons.icon_nav_cold}
                        onPushNavigator = {() => {
                            this.onPushNavigator(navigations[6], 'BusinessList');
                        }}
                    />}
                    {navigations.length >= 7 && <NavigatorItem
                        navigatorName = {'更多'}
                        navigatorIcon = {GlobalIcons.icon_nav_more}
                        onPushNavigator = {() => {
                            toastShort('敬请期待');
                        }}
                    />}
                </View>
                <HotNews hotNewsData = {hotNewsData} />
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
            </View>
        )
    }

    renderFooterView = () => {
        return <FooterComponent status = {this.state.showFoot} />;
    }

    renderEmptyView = () => {
        return this.state.showFoot == 0 && <EmptyComponent emptyTips={'对不起，暂未找到相关商家!'} />;
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
                    renderItem = {(item) => this.renderCompanyItem(item)}
                    onEndReachedThreshold = {0.2}
                    onEndReached = {this.dropLoadMore}
                    onRefresh = {this.freshNetData}
                    refreshing = {refreshing}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent = {() => this.renderHeaderView()}
                    ListFooterComponent = {this.renderFooterView}
                    ListEmptyComponent = {this.renderEmptyView}
                />
        )
    }

    updateLocation = (data) => {
        let {lat, lng} = this.state;
        if (lat === '') {
            this.updateState({
                lat: data.latitude,
                lng: data.longitude,
            });
        }
        console.log(lat, lng);
        this.dropLoadMore(data.latitude, data.longitude);
    }

    renderTitleView = () => {
        let {navigations} = this.state;
        return (
            <TouchableOpacity
                style = {[styles.headMiddleButton, styles.titleSearchView]}
                onPress = {() => this.onPushNavigator(navigations[2], 'BusinessList')}
            >
                <Text style={styles.titleSearchPlaceholder}>请输入您要找的关键词...</Text>
            </TouchableOpacity>
        )
    };

    renderLeftButton = () => {
        return (
            <TouchableOpacity
                style = {styles.headLeftButton}
                onPress = {() => toastShort(this.state.address, 'center')}
            >
                <Image source={GlobalIcons.icon_place} style={styles.headLeftIcon}/>
                <Text style={styles.headLeftButtonName} numberOfLines={this.state.addressLine}>{this.state.address}</Text>
            </TouchableOpacity>
        )
    };

    renderRightButton = () => {
        return (
            <TouchableOpacity
                style = {styles.headRightButton}
                onPress = {() => {
                    let page = global.user.loginState ? 'Mine' : 'Login';
                    this.onPushNavigator('登录', page);
                }}
            >
                <Image source={GlobalIcons.icon_user} style={styles.headRightIcon}/>
            </TouchableOpacity>
        )
    };

    render(){
        let { ready, refreshing, companyListData, lat } = this.state;
        let titleViewStyle = {
            marginLeft: 15,
        };
        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView = {this.renderTitleView()}
                    titleLayoutStyle = {titleViewStyle}
                    leftButton = {this.renderLeftButton()}
                    rightButton = {this.renderRightButton()}
                />
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {companyListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderCompanyItem(item)}
                        onEndReachedThreshold = {0.2}
                        onEndReached = {this.dropLoadMore}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent = {() => this.renderHeaderView()}
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
    // 顶部导航
    titleView: {},
    headLeftButton: {
        width: 60,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#123',
    },
    headLeftIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
        resizeMode: 'contain',
    },
    headLeftButtonName: {
        width: 40,
        fontSize: 12,
        color: '#fff',
        marginLeft: 5,
    },
    headMiddleButton: {},
    titleSearchView: {
        height: 32,
        borderWidth: 1,
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: '#fbfbfb',
        width: GlobalStyles.width - 160,
        borderColor: GlobalStyles.borderColor,
    },
    titleSearchPlaceholder: {
        fontSize: 13,
        color: '#888',
        marginLeft: 10,
    },
    headRightButton: {
        width: 58,
        marginRight: 10,
        alignItems: 'flex-end',
        // backgroundColor: '#123',
    },
    headRightIcon: {
        width: 22,
        height: 22,
        tintColor: '#fff',
        resizeMode: 'contain',
    },

    containerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorTips: {
        fontSize: 15,
        color: '#666',
    },
    loadingView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeNavigationView: {
        flexWrap: 'wrap',
        paddingTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    shopListView: {
        flex: 1,
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
        height: 40,
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
        fontSize: 14,
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