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
    PixelRatio,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native'
import Spinner from 'react-native-spinkit'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import {ACTION_MINE, ACTION_FLOW} from '../../constant/EventActions'
import UtilMap from '../../util/utilsMap'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'
import ModalView from '../../component/common/shopTagPoup'

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
        this.state = {
            user: global.user ? global.user.userData : '',
            start: '',
            end: '',
            ready: false,
            loading: false,
            loadMore: false,
            refreshing: false,
            item: params.item !== '' ? params.item : '',
            businessInfo: '',
            service: [],
            isCollect: '0',
            addressInfo: {
                name: '',
                lng: '',
                lat: '',
            },
            canBack: false,
            modalVisible: false,
            isRefreshing: false,
            error: false,
            errorInfo: '',
        };
        this.netRequest = new NetRequest();
        this.lastActionTime = 0;
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

    // static navigationOptions = ({ navigation, screenProps }) => ({
    //     title: navigation.state.params.pageTitle,
    // });


    componentDidMount(){
        this.getLocalUser();
        this.loadNetData();
        this.timer = setTimeout(() => {
            this.updateState({
                ready: true,
            })
        },50);
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        this.timer && clearTimeout(this.timer);
        this.loadingTimer && clearTimeout(this.loadingTimer);
        this.props.navigation.state.params.reloadData();
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

    modalVisible = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
        })
        // console.log(this.state.modalVisible);
    };

    getLocalUser = () => {
        // consoleLog(global.user);
        if (!global.user.loginState) {
            return;
        } else {
            let {userData, loginState} = global.user;
            this.updateState({
                user: userData,
            })
        }
    };

    loadNetData = () => {
        let { user, item } = this.state;
        user = user !== '' ? user : global.user.userData;
        let url = NetApi.businessDetail + item.id + '/uid/' + user.uid;
        // this.setState({
        //     loading: false,
        //     error: false,
        // });
        this.loadingTimer = setTimeout(() => {
            this.netRequest.fetchGet(url)
                .then( result => {
                    if (result && result.code === 1) {
                        this.updateState({
                            loading: true,
                            error: false,
                            isRefreshing: false,
                            businessInfo: result.data,
                            service: result.data.service,
                            isCollect: result.data.iscollect,
                            addressInfo: result.data.addressinfo,
                        })
                    } else {
                        this.updateState({
                            loading: false,
                        });
                        this.timer1 = setTimeout(() => {
                            toastShort(result.msg);
                            this.updateState({
                                error: true,
                                errorInfo: result.msg
                            });
                        })
                    }
                    // console.log('详情页', result);
                })
                .catch( error => {
                    // console.log('详情页', error);
                    this.updateState({
                        error: true,
                        errorInfo: error
                    })
                })
        }, 1000);
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
            companyListData: this.state.companyListData.concat(result.data.store)
            // companyListData: []
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
                companyListData: result.data.store
            })
        }
    }

    onSubmitSearch = () => {
        let { item, start, end, businessInfo } = this.state;
        // let url = NetApi.businessService;
        // let data = {
        //     sid: item.id,
        //     start: start,
        //     end: end,
        //     page: '0',
        // };
        // this.netRequest.fetchPost(url, data)
        //     .then( result => {
        //         if (result && result.code == 1) {
        //             this.updateState({
        //                 loading: true,
        //                 service: result.data.service,
        //             })                    
        //         } else {
        //             toastShort(result.msg);
        //         }
        //         // console.log('详情页', result);
        //     })
        //     .catch( error => {
        //         // console.log('详情页', error);
        //     })
        const { navigate } = this.props.navigation;
        navigate('BusinessServiceList', {
            item: item,
            start: start,
            end: end,
            disinfo: businessInfo.disinfo,
            pageTitle: 'pageTitle',
            reloadData: () => this.loadNetData(),
        });
    }

    /**
     * 拨打电话
     * @Author   Menger
     * @DateTime 2018-02-27
     */
    makeCall = () => {
        let { businessInfo } = this.state;
        let url = 'tel: ' + businessInfo.mobile;
        // this.modalVisible();
        // console.log(businessInfo.mobile);
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    // console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err)=>{
                // console.log('An error occurred', err)
            });
    }

    pushToNavigation = (address) => {
        if (address && address.lat && address.lng) {
            UtilMap.turnToMapApp(address.lng, address.lat, 'gaode', address.name);
        } else {
            toastShort('暂未获得该店地址，无法开启导航');
            return;
        }
    }

    onPushToNextPage = (pageTitle, page, params = {}) => {
        let nowTime = new Date().getTime();
        if ((nowTime - this.lastActionTime) <= 500 && true) {
            // console.warn('间隔时间内重复点击了');
            return false;
        }
        this.lastActionTime = nowTime;
        // console.log(pageTitle, page);
        let {navigate} = this.props.navigation;
        navigate(page, {
            pageTitle: pageTitle,
            ...params,
        });
    };

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
        return (
            <BusinessServicesItem
                item = {item}
                onPushToFlow = {() => this.onPushToFlow(item)}
            />
        )
    }

    renderServiceAddressItem = ({item}) => {
        return (
            <View style={{height: 40, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{flex: 3, fontSize: 14, color: '#666',}} numberOfLines={2}><Text style={{fontSize: 15, color: '#333'}}>(服务点)</Text> {item.name}</Text>
                <TouchableOpacity
                    style={{flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',}}
                    onPress={() => this.pushToNavigation(item)}
                >
                    <Text style={{fontSize: 13, color: '#888'}}>{item.distance}</Text>
                    <Image source={GlobalIcons.icon_place} style={[{width: 15, height: 15, resizeMode: 'contain', marginRight: 0, marginLeft: 6,}]} />
                </TouchableOpacity>
            </View>
        )
    }

    renderCommentItem = (item) => {
        return (
            <BusinessCommentItem
                item = {item}
            />
        )
    }

    renderServicesHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>为您找到的物流公司</Text>
                <View style={styles.sortView}>
                    <Text style={styles.sortTips}>排序</Text>
                </View>
            </View>
        )
    }

    renderServicesAddFooterView = () => {
        // return this.state.loadMore && <ActivityIndicatorItem />;
        if (this.state.service.length <= 0) {
            return null;
        }
        return (
            <View style={styles.listFooterView}>
                <View style={[GlobalStyles.horLine, styles.listFooterHorLine]} />
                <TouchableOpacity
                    style = {styles.listFooterBtnView}
                    onPress = {() => this.onPushToNextPage('门店服务点', 'BusinessServiceAddList', {item: this.state.businessInfo})}
                >
                    <Text style={styles.listFooterBtnName}>点击查看全部</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderServicesFooterView = () => {
        // return this.state.loadMore && <ActivityIndicatorItem />;
        if (this.state.service.length <= 0) {
            return null;
        }
        return (
            <View style={styles.listFooterView}>
                <View style={[GlobalStyles.horLine, styles.listFooterHorLine]} />
                <TouchableOpacity
                    style = {styles.listFooterBtnView}
                    onPress = {() => this.onSubmitSearch()}
                >
                    <Text style={styles.listFooterBtnName}>点击查看全部</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderCommentHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>用户评价（{this.state.businessInfo.evaluate_count}）</Text>
            </View>
        )
    }

    renderCommentFooterView = () => {
        return this.state.showFoot == 0 && <EmptyComponent emptyTips = {'暂无评价'} />;
    }

    renderCommentEmptyView = () => {
        return <EmptyComponent emptyTips = {'对不起，当前暂时没有找到相关评价'} />;
    }

    renderServiceEmptyView = () => {
        return <EmptyComponent emptyTips = {'暂未找到相关服务'} />;
    }

    renderSeparator = () => {
        return <View style={[GlobalStyles.horLine, styles.separatorStyle]} />;
    }

    collectBusiness = () => {
        let url = NetApi.businessCollect;
        let data = {
            uid: this.state.user.uid,
            sid: this.state.item.id,
        };
        if (data.uid == '') {
            toastShort('请登录后收藏！');
            return;
        }
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == '1') {
                    toastShort(result.msg);
                    // this.state.businessInfo.iscollect = result.data;
                    this.updateState({
                        isCollect: result.data,
                        // businessInfo: this.state.businessInfo
                    })
                } else {
                    toastShort(result.msg);
                }
                // console.log('详情页', result);
            })
            .catch( error => {
                // console.log('详情页', error);
            })
    }

    renderLeftButton = () => {
        return (
            <TouchableOpacity
                style = {{padding: 8}}
                onPress = {() => { this.state.canBack && this.onBack()}}
            >
                <Image style={styles.leftButtonIcon} source={GlobalIcons.icon_angle_left_white}/>
            </TouchableOpacity>
        )
    }

    renderRightButton = () => {
        let { isCollect } = this.state;
        return (
            <TouchableOpacity
                style = {GlobalStyles.rightButton}
                onPress = {() => this.collectBusiness()}
            >
                <Image source={isCollect == 1 ? collectedIcon : collectIcon} style={styles.collectIcon} />
            </TouchableOpacity>
        )
    }

    onScroll = (data) => {
        // console.log(data.nativeEvent.contevtOffset);//水平滚动距离
        // console.log(data.nativeEvent.contevtOffset);//垂直滚动距离 
    }

    render(){
        const { loading, ready, refreshing, isRefreshing,
        businessInfo, isCollect, service, addressInfo,
        modalVisible, MODALVIEW_CONFIG, error, errorInfo } = this.state;
        let navigationBarStyle = {
            zIndex: 2,
            backgroundColor: 'transparent',
        };
        if (!loading) {
            // console.log( error);
            return (
                <View style={styles.container}>
                    <NavigationBar
                        title = {''}
                        style = {navigationBarStyle}
                        statusBar = {{barStyle: 'dark-content',}}
                        leftButton = {this.renderLeftButton()}
                        rightButton = {this.renderRightButton()}
                    />
                    <View style={styles.content}>
                        {error ? <TouchableOpacity
                                style={GlobalStyles.emptyWrap}
                                onPress={this.loadNetData}
                            >
                                <Image source={GlobalIcons.icon_no_record} style={GlobalStyles.emptyIcon} />
                                <Text style={GlobalStyles.emptyTips}>{errorInfo}，点击重试或返回</Text>
                            </TouchableOpacity>
                            : <Spinner style={styles.spinner} isVisible={!loading} size={50} type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                        }
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <NavigationBar
                        title = {''}
                        style = {navigationBarStyle}
                        statusBar = {{barStyle: 'dark-content',}}
                        leftButton = {this.renderLeftButton()}
                        rightButton = {this.renderRightButton()}
                    />
                    {loading ?
                        <ScrollView
                            style = {styles.scrollContainer}
                            // onScroll = {(event) => this.onScroll(event)}
                            scrollEventThrottle = {10}
                            refreshControl={
                                <RefreshControl
                                    title='Loading...'
                                    refreshing={isRefreshing}
                                    onRefresh={this.loadNetData}
                                    tintColor="#0398ff"
                                    colors={['#0398ff']}
                                    progressBackgroundColor="#fff"
                                />
                            }
                        >
                            <View style={GlobalStyles.bannerViewWrap}>
                                <Image source={{uri: businessInfo.img}} style={GlobalStyles.bannerImg} />
                            </View>
                            <View style={styles.shopInfoView}>
                                <View style={styles.shopInfoItem}>
                                    <Text style={styles.shopName}>{businessInfo.name}</Text>
                                </View>
                                <View style={styles.shopInfoItem}>
                                    <View>
                                        <ShopRankView
                                            star = {businessInfo.star}
                                            titleStyle = {{fontSize: 14,}}
                                            iconStyle = {{width: 14, height: 14,}}
                                            pointStyle = {{fontSize: 15}}
                                        />
                                        {businessInfo.style == 1 && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.companyType}>企业</Text>
                                            <Text style={styles.companyName}>: {businessInfo.company}</Text>
                                        </View>}
                                    </View>
                                    <ShopTagsView tags={businessInfo.tags} page_flag={'detail'} onSetModal = {()=> this.modalVisible()} />
                                </View>
                                <View style={[GlobalStyles.horLine, styles.horLine]} />
                                <View style={styles.shopInfoItem}>
                                    <TouchableOpacity style={styles.shopAddressView}
                                        onPress={() => this.pushToNavigation(addressInfo)}
                                    >
                                        <Image source={GlobalIcons.icon_place} style={styles.shopPlaceIcon} />
                                        <View style={styles.shopAddressDetail}>
                                            <Text style={styles.shopAddressCon} numberOfLines={2}>{businessInfo.dress}</Text>
                                            <Text style={styles.shopDistance}>{businessInfo.distance}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style = {styles.shopPhoneView}
                                        onPress = {() => {
                                            tel: this.makeCall()
                                        }}
                                    >
                                        <Image source={GlobalIcons.icon_phone} style={styles.shopPhoneIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {businessInfo.service_points.length > 0 && <View style={{marginBottom: 10,}}>
                                <View style={styles.searchView}>
                                    <View style={styles.searchTitleView}>
                                        <Text style={[styles.shopName]}>请选择服务点</Text>
                                    </View>
                                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                                </View>
                                {ready ?
                                    <FlatList
                                        style = {styles.shopListView}
                                        keyExtractor = { item => item.id}
                                        data = {businessInfo.service_points}
                                        extraData = {this.state}
                                        renderItem = {(item) => this.renderServiceAddressItem(item)}
                                        onEndReachedThreshold = {0.1}
                                        onEndReached = {(info) => this.dropLoadMore(info)}
                                        onRefresh = {this.freshNetData}
                                        refreshing = {refreshing}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        // ListHeaderComponent = {this.renderServicesHeaderView}
                                        ListFooterComponent = {this.renderServicesAddFooterView}
                                        ListEmptyComponent = {this.renderServiceEmptyView}
                                    />
                                    : <ActivityIndicatorItem />
                                }
                            </View>}

                            <View style={[styles.searchView,]}>
                                <View style={styles.searchTitleView}>
                                    <Text style={styles.shopName}>所有线路</Text>
                                    {businessInfo.disinfo !== '' ? <Text style={styles.searchTitleConTips}>优惠信息：{businessInfo.disinfo}</Text> : null}
                                </View>
                                <View style={[GlobalStyles.horLine, styles.horLine]} />
                                {1 > 2 && <View style={styles.searchContentView}>
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
                                        onPress = {() => this.onSubmitSearch()}
                                    >
                                        <Text style={styles.searchBtnItem}>确认</Text>
                                    </TouchableOpacity>
                                </View>}
                            </View>
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
                            <View style={[styles.shopRemarkTipsView,]}>
                                <View style={styles.shopListViewTitle}>
                                    <Text style={styles.titleName}>温馨提示：</Text>
                                </View>
                                <View style={styles.remarkConView}>
                                    <Text style={styles.remarkConText}>{businessInfo.reminder}</Text>
                                </View>
                            </View>
                            {ready ?
                                <FlatList
                                    style = {[styles.shopListView, {marginTop: 10, marginBottom: 64}]}
                                    keyExtractor = { item => item.id}
                                    data = {businessInfo.evaluate}
                                    extraData = {this.state}
                                    renderItem = {(item) => this.renderCommentItem(item)}
                                    onEndReachedThreshold = {0.1}
                                    onEndReached = {(info) => this.dropLoadMore(info)}
                                    onRefresh = {this.freshNetData}
                                    refreshing = {refreshing}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListHeaderComponent = {this.renderCommentHeaderView}
                                    ListFooterComponent = {this.renderCommentFooterView}
                                    ListEmptyComponent = {this.renderCommentEmptyView}
                                />
                                : <ActivityIndicatorItem />
                            }
                        </ScrollView>
                        :
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Spinner style={styles.spinner} isVisible={loading} size={50} type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                        </View>
                    }
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginBottom: 60,
        backgroundColor: GlobalStyles.bgColor,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#123',
    },
    scrollContainer: {
        marginTop: GlobalStyles.__IOS__ ? -64 : -70,
        // paddingBottom: 64,
        // backgroundColor: '#123',
    },
    companyType: {
        marginRight: 6,
        marginTop: 5,
        fontSize: 13,
        borderWidth: 1 / PixelRatio.get(),
        borderRadius: 3,
        borderColor: GlobalStyles.themeColor,
        paddingVertical: 2,
        paddingHorizontal: 3,
        color: GlobalStyles.themeColor,
    },
    companyName: {
        fontSize: 13,
        marginTop: 5,
        color: '#333',
    },
    leftButtonIcon: {
        width: 26,
        height: 26,
        tintColor: '#333',
        resizeMode: 'contain',
    },
    collectIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
        tintColor: GlobalStyles.themeColor,
    },
    fixedHeaderBtnView: {
        position: 'absolute',
        top: 20,
        height: 40,
        zIndex: 2,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: GlobalStyles.width,
        backgroundColor: 'transparent',
    },
    fixedBtnBackItem: {},
    fixedBtnRightItem: {},
    headerBtnIcon: {
        fontSize: 15,
        color: '#fff',
    },
    horLine: {
        marginVertical: 10,
    },
    shopInfoView: {
        marginBottom: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    shopInfoItem: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    shopName: {
        fontSize: 16,
    },
    shopTagsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    shopTagsIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    shopTagsName: {
        fontSize: 12,
        marginLeft: 5,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
        color: GlobalStyles.themeColor,
        borderColor: GlobalStyles.themeColor,
    },
    
    shopAddressView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopPlaceIcon: {
        width: 22,
        height: 22,
        marginRight: 10,
        resizeMode: 'contain',
    },
    shopAddressDetail: {
        flex: 1,
    },
    shopAddressCon: {
        fontSize: 13,
        color: '#555',
    },
    shopDistance: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    shopPhoneView: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        // backgroundColor: '#123',
        alignItems: 'flex-end',
    },
    shopPhoneIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    searchHorLine: {
        width: 20,
        marginHorizontal: 10,
        backgroundColor: '#555',
    },
    searchView: {
        paddingTop: 15,
        // paddingBottom: 5,
        paddingHorizontal: 15,
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
        fontSize: 13,
        color: GlobalStyles.themeColor,
    },
    searchContentView: {
        marginTop: -5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: GlobalStyles.width - 130,
        // backgroundColor: '#123',
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
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
        // backgroundColor: '#f60',
    },
    searchBtnItem: {
        color: '#666',
        fontSize: 16,
    },
    shopListView: {
        flex: 1,
        marginTop: -10,
        backgroundColor: '#fff',
    },
    shopListViewTitle: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        borderColor: GlobalStyles.borderColor,
    },
    titleName: {
        fontSize: 16,
        color: '#333',
    },
    sortView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sortTips: {
        fontSize: 16,
        color: '#333',
    },
    listFooterView: {
        width: GlobalStyles.width,
        alignItems: 'center',
    },
    listFooterHorLine: {
        width: GlobalStyles.width,
    },
    listFooterBtnView: {
        height: 35,
        // backgroundColor: '#f60',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listFooterBtnName: {
        color: GlobalStyles.themeColor,
    },
    shopRemarkTipsView: {
        marginTop: 10,
        // paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    remarkConView: {
        padding: 15,
    },
    remarkConText: {
        color: '#555',
        lineHeight: 20,
    },
    separatorStyle: {
        marginLeft: 15,
        width: GlobalStyles.width - 30,
    },
    errorTips: {
        fontSize: 15,
        color: '#6666',
    }
});
