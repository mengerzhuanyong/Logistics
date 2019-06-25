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
import JPushModule from 'jpush-react-native'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import ModalView from '../../component/common/shopTagPoup'
import { toastShort, consoleLog } from '../../util/utilsToast'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import FooterComponent from '../../component/common/footerComponent'
import EmptyComponent from '../../component/common/EmptyComponent'
import {Menu, Button} from 'teaset'
import {Geolocation} from 'react-native-baidu-map'
import {checkFloat} from '../../util/utilsRegularMatch'
import {HorizontalLine, VerticalLine} from '../../component/common/commonLine'
import {clearAllTimeout} from '../../util/utilsTool'
import FlatListView from '../../component/common/flatListView'

import BannerView from '../../component/common/Banner'
import HotNews from '../../component/common/HotNews'
import shopTagsModalContent from '../../component/common/shopTagsModalContent'
import NavigatorItem from '../../component/home/navigatorItem'
import BusinessItem from '../../component/common/businessItem'
import NavigationsData from '../../asset/json/systemNavigations.json'

const __IOS__ = Platform.OS === 'ios';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            showFoot: 0,
            loadMore: false,
            error: false,
            errorInfo: "",
            canPress: true,
            refreshing: false,
            companyListData: [],
            navigations: NavigationsData.data.indexNavigations,
            servicesNavigations: [
                {id: 1, name: '行业动态', link: ''},
                {id: 2, name: '速芽动态', link: ''},
                {id: 3, name: '开心一刻', link: ''},
            ],
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
            modalVisible: false,
            emptyTips: '',
        };
        this.netRequest = new NetRequest();
        this.lastActionTime = 0;
        this.page = 1;
        this.pageSize = 10;
    }

    async componentDidMount(){
        // this.jpushRelative();
        this.getNavigations();
        this.getBannerData();
        this.getLocation();
        this.timer3 = setTimeout(() => {
            this.freshNetData();
        }, 1000);
        if (global.user && global.user.loginState) {
            this.setState({
                user: global.user.userData
            })
            this.setAlias(global.user.userData.uid);
        }
    }

    componentWillUnmount(){
        let timers = [this.timer1, this.timer2, this.timer4];
        clearAllTimeout(timers);
        // JPushModule.clearAllNotifications();
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    jpushRelative = () => {
        // JPushModule.addReceiveOpenNotificationListener(map => {
        //     // console.log('Opening notification!')
        //     // console.log('map.extra: ' + map.extras)
        //     this.jumpSecondActivity();
        //     __IOS__ && this.setBadge();
        //     // JPushModule.jumpToPushActivity("SecondActivity");
        // })
    }

    setAlias = (alias) => {
        alias = 'user_id_' + alias;
        // console.log(alias);
        getAlias = () => {
            JPushModule.getAlias(map => {
                if (map.errorCode === 0) {
                    // console.log('Get alias succeed, alias: ' + map.alias)
                } else {
                    // console.log('Get alias failed, errorCode: ' + map.errorCode)
                    JPushModule.setAlias(alias, map => {
                        if (map.errorCode === 0) {
                            // console.log('set alias succeed', map)
                        } else {
                            // console.log('set alias failed, errorCode: ', map.errorCode)
                        }
                    })
                }
            })
        }
    }

    onPushToNextPage = (pageTitle, page, params = {}) => {
        let nowTime = new Date().getTime();
        if ((nowTime - this.lastActionTime) <= 500 && true) {
            return false;
        }
        this.lastActionTime = nowTime;
        let user = global.user ? global.user.userData : '';
        let {navigate} = this.props.navigation;
        page = user && user.token ? page : 'Login';
        navigate(page, {
            pageTitle: pageTitle,
            ...params,
        });
    };

    onPushToBusiness = (item) => {
        item = item.item;
        const { navigate } = this.props.navigation;
        navigate('BusinessDetail', {
            pageTitle: 'pageTitle',
            item: item,
            reloadData: () => this.freshNetData(),
        })
    };

    onPushNavigator = (nav, compent) => {
        const { navigate } = this.props.navigation;
        navigate(compent, {
            navItem: nav,
            pageTitle: 'pageTitle',
            reloadData: () => this.freshNetData(),
        })
    };

    modalVisible = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        })
    };

    getLocation = async () => {
        this.setState({
            canPress: false
        });
        let data = await Geolocation.getCurrentPosition();
        // console.log(data);
        this.freshNetData();
        this.timer5 = setTimeout(() =>{
            this.setState({
                canPress: true
            });
        }, 1000);
        if (!data) {
            toastShort('定位失败，请稍后重试');
            return;
        }
        let location = checkFloat(data.latitude);
        if (location) {
            global.lat = data.latitude;
            global.lng = data.longitude;
            this.setState({
                lat: data.latitude,
                lng: data.longitude,
            });
            this.postLocation(data.latitude, data.longitude);
        }
    };

    setBadge = () => {
        JPushModule.setBadge(0, (badgeNumber) => {
            // console.log(badgeNumber);
            // alert(badgeNumber);
        })
    }

    jumpSecondActivity = () => {
        // console.log('jump to SecondActivity');
        this.props.navigation.navigate('Mine');
    }

    postLocation = async (lat = this.state.lat, lng = this.state.lng) => {
        // console.log(lat, lng);
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
        this.netRequest.fetchPost(url, data)
            .then( result => {
                // console.log(result);
                this.freshNetData();
                this.setState({
                    ready: true,
                    showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
                    address: result.data.address || '无法解析该地点',
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
                    this.setState({
                        bannerData: result.data.banner,
                        hotNewsData: result.data.headlines,
                    });
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                // console.log(error);
                toastShort('error');
            })
    };

    getNavigations = () => {
        let url = NetApi.navigations;
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code == 1) {
                    this.setState({
                        navigations: result.data.indexNavigations,
                        servicesNavigations: result.data.servicesNavigations
                    })
                }
            })
            .catch( error => {
                // console.log(error);
                toastShort('error');
            })
    };

    loadNetData = (page) => {
        let url = NetApi.index;
        let data = {
            page: page,
            pageSize: this.pageSize
        };
        return this.netRequest.fetchPost(url, data, true)
            .then(result => {
                return result;
            })
            .catch(error => {
                // toastShort('error');
            })
    };

    freshNetData = async () => {
        let {listData} = this.state;
        let result = await this.loadNetData(0);
        this.timer1 = setTimeout(() => {
            this.page = 1;
            this.setState();
            // 调用停止刷新
            this.flatList && this.flatList.stopRefresh()
        }, 600);
        if (!result) {
            return;
        }
        this.setState({
            ready: true,
            emptyTips: result.msg,
            listData: result.data.store,
            address: result.data.address,
        });
    };

    dropLoadMore = async () => {
        let {listData} = this.state;
        let result = await this.loadNetData(this.page);
        if (!result) {
            return;
        }
        let totalPage = result.data.totalPage;
        this.timer2 = setTimeout(() => {
            let dataTemp = listData;
            //模拟数据加载完毕,即page > 0,
            if (this.page < totalPage) {
                this.setState({
                    emptyTips: result.msg,
                    listData: dataTemp.concat(result.data.store),
                });
            }
            this.flatList && this.flatList.stopEndReached({
                allLoad: this.page === totalPage
            });
            this.page++;
            // console.log('page, totalPage',this.page, totalPage)
        }, 600);
    };

    _captureRef = (v) => {
        this.flatList = v
    };

    _keyExtractor = (item, index) => {
        return `item_${index}`;
    };

    renderListItem = (item) => {
        return (
            <BusinessItem
                item = {item}
                {...this.props}
                onPushToBusiness = {()=> this.onPushToBusiness(item)}
                onSetModal = {()=> this.modalVisible()}
            />
        );
    };

    renderHeaderView = () => {
        let { navigations, bannerData, hotNewsData, servicesNavigations } = this.state;
        return (
            <View style={styles.container}>
                <BannerView bannerData = {bannerData} />
                <View style={styles.homeNavigationView}>
                    <View style={[styles.homeNavigationLeftView]}>
                        <NavigatorItem
                            style={styles.largeItemView}
                            iconStyle={styles.largeItemIcon}
                            titleStyle={styles.largeItemTitle}
                            navigatorName = {navigations[2].name}
                            navigatorIcon = {GlobalIcons.icon_logistics}
                            // navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[2], 'BusinessList');
                            }}
                        />
                    </View>
                    <View style={[styles.homeNavigationRightView]}>
                        <NavigatorItem
                            navigatorName = {navigations[0].name}
                            navigatorIcon = {GlobalIcons.icon_delivery_now}
                            // navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[0], 'BusinessList');
                            }}
                        />
                        <NavigatorItem
                            navigatorName = {navigations[3].name}
                            navigatorIcon = {GlobalIcons.icon_plane}
                            // navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[3], 'BusinessList');
                            }}
                        />
                        {navigations.length >= 5 && <NavigatorItem
                            navigatorName = {navigations[4].name}
                            navigatorIcon = {GlobalIcons.icon_nav_world}
                            // navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[4], 'BusinessList');
                            }}
                        />}
                        {navigations.length >= 6 && <NavigatorItem
                            navigatorName = {navigations[5].name}
                            navigatorIcon = {GlobalIcons.icon_nav_cold}
                            // navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[5], 'BusinessList');
                            }}
                        />}
                        {navigations.length >= 7 && <NavigatorItem
                            navigatorName = {navigations[6].name}
                            navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            // navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[6], 'BusinessList');
                            }}
                        />}
                        {navigations.length >= 7 && <NavigatorItem
                            navigatorName = {navigations[7].name}
                            navigatorIcon = {GlobalIcons.icon_nav_train}
                            // navigatorIcon = {GlobalIcons.icon_nav_world_logistics}
                            onPushNavigator = {() => {
                                this.onPushNavigator(navigations[7], 'BusinessList');
                            }}
                        />}
                    </View>
                </View>
                <HotNews hotNewsData = {hotNewsData} />
                <View style={styles.hotServicesView}>
                    <View style={styles.hotServicesTitleView}>
                        {1 > 2 && <Image source={GlobalIcons.icon_hot} style={styles.titleIcon}/>}
                        <Text style={styles.servicesTitleName}>🔥热门服务</Text>
                    </View>
                    <HorizontalLine lineStyle={styles.servicesHorLine} />
                    <View style={styles.hotServicesContentView}>
                        <TouchableOpacity
                            style={[styles.hotServicesItemView, {backgroundColor: '#ff000000'}]}
                            onPress = {() => this.onPushToNextPage(servicesNavigations[0].name, 'CooperateDetail', {webUrl: servicesNavigations[0].link})}
                        >
                            <Text style={styles.itemName}>{servicesNavigations[0].name}</Text>
                            <Image source={GlobalIcons.icon_trend} style={styles.itemIcon}/>
                        </TouchableOpacity>
                        <VerticalLine lineStyle={styles.verLine} />
                        <TouchableOpacity
                            style={[styles.hotServicesItemView, {backgroundColor: '#ffff0000'}]}
                            onPress = {() => this.onPushToNextPage(servicesNavigations[1].name, 'CooperateDetail', {webUrl: servicesNavigations[1].link})}
                        >
                            <Text style={styles.itemName}>{servicesNavigations[1].name}</Text>
                            <Image source={GlobalIcons.logo} style={styles.itemIcon}/>
                        </TouchableOpacity>
                        <VerticalLine lineStyle={styles.verLine} />
                        <TouchableOpacity
                            style={[styles.hotServicesItemView, {backgroundColor: '#00800000'}]}
                            onPress = {() => this.onPushToNextPage(servicesNavigations[2].name, 'CooperateDetail', {webUrl: servicesNavigations[2].link})}
                        >
                            <Text style={styles.itemName}>{servicesNavigations[2].name}</Text>
                            <Image source={GlobalIcons.icon_happy} style={styles.itemIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
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

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    };

    renderTitleView = () => {
        let {navigations} = this.state;
        return (
            <TouchableOpacity
                style = {[styles.headMiddleButton, styles.titleSearchView]}
                onPress = {() => this.onPushNavigator('搜索', 'Search')}
            >
                <Text style={styles.titleSearchPlaceholder}>请输入您要找的关键词...</Text>
            </TouchableOpacity>
        )
    };

    renderLeftButton = () => {
        return (
            <TouchableOpacity
                style = {styles.headLeftButton}
                onPress = {() => {
                    if (this.state.canPress) {
                        this.getLocation();
                        toastShort(this.state.address || '地址不存在', 'center');
                    }
                }}
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
                    let page = global.user.loginState ? 'MineFeedBackReward' : 'Login';
                    let pageTitle = global.user.loginState ? '有奖反馈' : '登录';
                    this.onPushToNextPage(pageTitle, page);
                }}
            >
                <Image source={GlobalIcons.icon_message} style={styles.headRightIcon}/>
            </TouchableOpacity>
        )
    };

    renderEmptyView = () => {
        // console.log(this.state.emptyTips);
        return <EmptyComponent emptyTips={this.state.emptyTips} />;
    }

    render() {
        let {ready, listData, refreshing, modalVisible} = this.state;
        // console.log('listData--->', listData);
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
                {ready && listData ?
                    <FlatListView
                        ref={this._captureRef}
                        data={listData}
                        style={styles.shopListView}
                        renderItem={this.renderListItem}
                        keyExtractor={this._keyExtractor}
                        onEndReached={this.dropLoadMore}
                        onRefresh={this.freshNetData}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent = {this.renderHeaderView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
                }
                {/*<TouchableOpacity
                    style={styles.signBtnView}
                    onPress={() => this.onPressToSign}
                >
                    <Image source={GlobalIcons.icon_sign_in} style={styles.signBtnIcon} />
                </TouchableOpacity>*/}
                {modalVisible &&
                    <ModalView
                        show = {modalVisible}
                        cancelFoo = {() => this.modalVisible()}
                        confirmFoo = {() => this.makeCall()}
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
        paddingTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    homeNavigationLeftView: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    largeItemView: {
        width: 80,
    },
    largeItemIcon: {
        width: 60,
        height: 60,
    },
    largeItemTitle: {},
    homeNavigationRightView: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
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
    },
    servicesHorLine: {
        backgroundColor: '#ddd',
        width: GlobalStyles.width,
    },
    hotServicesView: {
        marginTop: -10,
        backgroundColor: '#fff',
    },
    hotServicesTitleView: {
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleIcon: {
        width: 22,
        height: 22,
        marginRight: 6,
        resizeMode: 'contain',
    },
    servicesTitleName: {
        fontSize: 16,
        color: '#333',
    },
    hotServicesContentView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // width: GlobalStyles.width + 1,
    },
    verLine: {
        height: 88,
        backgroundColor: '#ddd',
    },
    hotServicesItemView: {
        flex: 1,
        height: 88,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    itemIcon: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
    },

    signBtnView: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    signBtnIcon: {
        width: 50,
        height: 50,
    },
    // modalStyle: {
    //     borderRadius: 0,
    //     paddingTop: 20,
    //     marginHorizontal: 30,
    // },
    // modalTitleStyle: {
    //     color: '#999',
    //     fontWeight: '400',
    // },
    // modalContextStyle: {
    //     marginBottom: 20,
    //     color: GlobalStyles.themeColor,
    // },
});
