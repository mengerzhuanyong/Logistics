/**
 * 速芽物流用户端 - BusinessIndex
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Switch,
    Platform,
    FlatList,
    Keyboard,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Spinner from 'react-native-spinkit'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'
import ModalView from '../../component/common/shopTagPoup'
import {Menu, Button} from 'teaset'
import FlatListView from '../../component/common/flatListView'

import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import BusinessItem from '../../component/common/businessItem'
import EmptyComponent from '../../component/common/EmptyComponent'
import FooterComponent from '../../component/common/footerComponent'

import ShopData from '../../asset/json/homeBusiness.json'

const isAndroid = Platform.OS === 'android';

export default class BusinessIndex extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            ready: false,
            showFoot: 0,
            store_name: '物流',
            start: '0',
            end: '0',
            error: false,
            errorInfo: "",
            loadMore: false,
            refreshing: false,
            type: params && params.navItem.style || '4',
            businessListData: [],
            canBack: false,
            notLimit: true,
            modalVisible: false,
            emptyTips: '', // 对不起，暂未找到相关商家
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        type: '1',
    };

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
        // await this.dropLoadMore();
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
        this.props.navigation.goBack();
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

    /**
     * 拨打电话
     * @Author   Menger
     * @DateTime 2018-02-27
     */
    makeCall = () => {
        // let { businessInfo } = this.state;
        // let url = 'tel: ' + '15066886007';
        // this.modalVisible();
        // // console.log(businessInfo.mobile);
        // Linking.canOpenURL(url)
        //     .then(supported => {
        //         if (!supported) {
        //             // console.log('Can\'t handle url: ' + url);
        //         } else {
        //             return Linking.openURL(url);
        //         }
        //     })
        //     .catch((err)=>{
        //         // console.log('An error occurred', err)
        //     });
    }

    // loadNetData = (sort, page) => {
    //     let {type, start, end, notLimit, store_name} = this.state;
    //     let url = NetApi.businessList;
    //     let data = {
    //         style: type,
    //         page: page,
    //         start: start,
    //         end: end,
    //         sort: sort,
    //         store_name,
    //         not_limit: notLimit,
    //     };
    //     return this.netRequest.fetchPost(url, data, true)
    //         .then( result => {
    //             // console.log('服务列表', result);
    //             this.setState({ready: true});
    //             return result;
    //         })
    //         .catch( error => {
    //             // console.log('服务列表', error);
    //             this.updateState({
    //                 ready: true,
    //                 error: true,
    //                 errorInfo: error
    //             })
    //         })
    // }

    // dropLoadMore = async () => {
    //     //如果是正在加载中或没有更多数据了，则返回
    //     if (this.state.showFoot != 0) {
    //         return;
    //     }
    //     if ((this.page != 1) && (this.page >= this.totalPage)) {
    //         return;
    //     } else {
    //         this.page++;
    //     }
    //     this.updateState({
    //         showFoot: 2
    //     })
    //     let result = await this.loadNetData(this.sortType, this.page);
    //     // console.log(this.totalPage);
    //     this.totalPage = result.data.pageSize;
    //     // // console.log(result);
    //     let foot = 0;
    //     if (this.page >= this.totalPage) {
    //         // console.log(this.totalPage);
    //         foot = 1; //listView底部显示没有更多数据了
    //     }
    //     if (result && result.code ==1) {
    //         this.updateState({
    //             showFoot: foot,
    //             businessListData: this.state.businessListData.concat(result.data.store)
    //         })
    //     } else {
    //         toastShort(result.msg);
    //         this.updateState({
    //             showFoot: foot,
    //             businessListData: this.state.businessListData
    //         })
    //     }
    // }

    // freshNetData = async (sort = `${this.sortType}`) => {
    //     let result = await this.loadNetData(sort, 0);
    //     if (result && result.code == 1) {
    //         this.page = 0;
    //         this.updateState({
    //             showFoot: 0,
    //             businessListData: result.data.store,
    //         })
    //     } else {
    //         toastShort(result.msg);
    //         this.updateState({
    //             showFoot: 0,
    //             businessListData: this.state.businessListData
    //         })
    //     }
    // }

    loadNetData = (sort, page) => {
        // let url = NetApi.index;
        // let data = {
        //     page: page,
        //     pageSize: this.pageSize
        // };
        let {type, start, end, notLimit, store_name} = this.state;
        let url = NetApi.businessList;
        let data = {
            style: type,
            page: page,
            start: start,
            end: end,
            sort: sort,
            store_name,
            not_limit: notLimit,
        };
        return this.netRequest.fetchPost(url, data, true)
            .then(result => {
                return result;
            })
            .catch(error => {
                // toastShort('error');
            })
    };

    freshNetData = async (sort = `${this.sortType}`) => {
        let {businessListData} = this.state;
        let result = await this.loadNetData(sort, 0);
        this.timer1 = setTimeout(() => {
            this.page = 0;
            this.setState({
                showFoot: 0,
            });
            // 调用停止刷新
            this.flatList && this.flatList.stopRefresh()
        }, 600);
        if (!result) {
            return;
        }
        this.setState({
            ready: true,
            showFoot: 0,
            businessListData: result.data.store,
        });
    };

    dropLoadMore = async () => {
        let {businessListData} = this.state;
        let result = await this.loadNetData(this.sortType, this.page);
        if (!result) {
            return;
        }
        let totalPage = result.data.pageSize;
        this.timer2 = setTimeout(() => {
            let dataTemp = businessListData;
            //模拟数据加载完毕,即page > 0,
            if (this.page < totalPage) {
                this.setState({
                    emptyTips: result.msg,
                    businessListData: dataTemp.concat(result.data.store),
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

    onSubmitSearch = async () => {
        Keyboard.dismiss();
        this.freshNetData();
    }

    onPushToBusiness = (item) => {
        item = item.item;
        const { navigate } = this.props.navigation;
        navigate('BusinessDetail', {
            pageTitle: 'pageTitle',
            item: item,
            reloadData: () => this.freshNetData(),
        })
    }

    showSortMenu = (align) => {
        this.menu.measure((x, y, width, height, pageX, pageY) => {
            let items = [
                {title: <Text style={styles.sortName}>综合排序</Text>, onPress: () => {this.freshNetData(1); this.sortType = 1}},
                {title: <Text style={styles.sortName}>星级排序</Text>, onPress: () => {this.freshNetData(2); this.sortType = 2}},
                {title: <Text style={styles.sortName}>距离排序</Text>, onPress: () => {this.freshNetData(3); this.sortType = 3}},
            ];
            Menu.show({x: pageX, y: pageY, width, height}, items, {align, popoverStyle: styles.sortContent,});
        });
    };

    renderCompanyItem = (item) => {
        return (
            <BusinessItem
                item = {item}
                {...this.props}
                onSetModal = {()=> this.modalVisible()}
                onPushToBusiness = {()=> this.onPushToBusiness(item)}
            />
        )
    }

    renderHeaderView = () => {
        let {notLimit, businessListData} = this.state;
        if (businessListData.length < 1) {
            return null;
        }
        return (
            <View style={styles.shopListViewTitle}>
                <View style={styles.switchView}>
                    <Text style={styles.titleName}>全国搜索</Text>
                    <Switch
                        style = {{marginLeft: 10,}}
                        tintColor = {'#ddd'}
                        onTintColor = {'#4caf50'}
                        // thumbTintColor = {isAndroid && notLimit ? '#4caf50' : '#ddd'}
                        value = {notLimit}
                        onValueChange = {(value) => {
                            this.setState({
                                notLimit: value
                            }, () => this.freshNetData(1))
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={[GlobalStyles.sortBtnView, styles.sortBtnView]}
                    ref={(menu) => this.menu = menu}
                    onPress={() => this.showSortMenu('end')}
                >
                    <Text style={[GlobalStyles.sortBtnName, styles.sortBtnName]}>排序</Text>
                    <Image source={GlobalIcons.icon_arrow_down} style={styles.arrowIcon} />
                </TouchableOpacity>
            </View>
        )
    }

    renderFooterView = () => {
        return <FooterComponent status = {this.state.showFoot} />;
    }

    renderEmptyView = () => {
        let {emptyTips} = this.state;
        return <EmptyComponent emptyTips={emptyTips} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    renderTitleView = () => {
        const { params } = this.props.navigation.state;
        let { navItem } = params;
        let titleView = (
            <View style={styles.pageTitleView}>
                <TextInput
                    style = {styles.searchInputItem}
                    placeholder = "商家名称"
                    placeholderTextColor = '#888'
                    underlineColorAndroid = {'transparent'}
                    onChangeText = {(text)=>{
                        this.setState({
                            store_name: text
                        })
                    }}
                />
            </View>
        );
        return titleView;
    }

    renderRightButton = () => {
        return (
            <TouchableOpacity
                style = {styles.searchBtnView}
                onPress = {() => this.onSubmitSearch()}
            >
                <Text style={styles.searchBtnItem}>搜索</Text>
            </TouchableOpacity>
        );
    };

    render(){
        const { ready, error, refreshing, businessListData, modalVisible, MODALVIEW_CONFIG } = this.state;
        console.log('ready---->', ready);
        return (
            <View style={styles.container}>
                <NavigationBar
                    titleView = {this.renderTitleView()}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    rightButton = {this.renderRightButton()}
                />
                {/*<View style={styles.searchView}>
                    <View style={styles.searchInputView}>
                        <View style={styles.searchInputItemView}>
                            <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeStartIcon]}>
                                <Text style={GlobalStyles.placeText}>发</Text>
                            </View>
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
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.searchInputItemView}>
                            <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeEndIcon]}>
                                <Text style={GlobalStyles.placeText}>收</Text>
                            </View>
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
                </View>*/}
                {ready ?
                    <FlatListView
                        ref={this._captureRef}
                        data={businessListData}
                        style={styles.shopListView}
                        renderItem={this.renderCompanyItem}
                        keyExtractor={this._keyExtractor}
                        onEndReached={this.dropLoadMore}
                        onRefresh={this.freshNetData}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent = {this.renderHeaderView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : null
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    pageTitleView: {
        height: 32,
        borderRadius: 18,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    pageTitle: {
        color: '#fff',
        fontSize: 16,
    },
    webTips: {
        fontSize: 14,
        marginLeft: 10,
        color: '#fefefe',
    },
    horLine: {
        marginVertical: 0,
        marginLeft: 20,
    },
    searchView: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    searchInputView: {
        width: GlobalStyles.width - 130,
    },
    searchInputItemView: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputItem: {
        flex: 1,
        height: 45,
        paddingLeft: 10,
    },
    placeText: {
        fontSize: 12,
        color: '#fff',
    },
    searchBtnView: {
        // width: 80,
        paddingLeft: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#123',
    },
    searchBtnItem: {
        color: '#fff',
        fontSize: 16,
    },
    shopListView: {
        // marginTop: 10,
        backgroundColor: '#fff',
    },
    shopListViewTitle: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        // backgroundColor: '#123',
        justifyContent: 'space-between',
        borderColor: GlobalStyles.borderColor,
    },
    switchView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleName: {
        fontSize: isAndroid ? 16 : 18,
        color: '#333',
    },
    sortBtnView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortBtnName: {},
    arrowIcon: {
        width: 15,
        height: 15,
        marginLeft: 5,
        resizeMode: 'contain',
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
    sortContent: {
        backgroundColor: '#fff'
    },
    sortName: {
        fontSize: 14,
        color: '#555',
    },
});
