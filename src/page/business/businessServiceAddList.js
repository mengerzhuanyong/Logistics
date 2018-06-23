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
import UtilMap from '../../util/utilsMap'
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

    pushToNavigation = (address) => {
        if (address && address.lat && address.lng) {
            UtilMap.turnToMapApp(address.lng, address.lat, 'gaode', address.name);
        } else {
            toastShort('暂未获得该店地址，无法开启导航');
            return;
        }
    }

    loadNetData = () => {
        let { item, start, end } = this.state;
        // console.log(item);
        let url = NetApi.businessServiceAddress + '/id/' + item.id;
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code === 1) {
                    this.updateState({
                        ready: true,
                        service: result.data
                    })
                }
            })
            .catch( error => {
                toastShort('error');
            })
    }

    dropLoadMore = async () => {}

    freshNetData = async () => {}

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

    renderCompanyItem = ({item}) => {
        // console.log(item);
        return (
            <View style={{height: 40, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{flex: 3, fontSize: 14, color: '#666',}} numberOfLines={2}><Text style={{fontSize: 15, color: '#333'}}>(服务点)</Text> {item.name}</Text>
                <TouchableOpacity
                    style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',}}
                    onPress={() => this.pushToNavigation(item)}
                >
                    <Text style={{fontSize: 13, color: '#888'}}>{item.distance}</Text>
                    <Image source={GlobalIcons.icon_place} style={[styles.shopPlaceIcon]} />
                </TouchableOpacity>
            </View>
        )
    }

    renderServiceEmptyView = () => {
        return <EmptyComponent emptyTips = {'暂未找到相关服务点'} />;
    }

    renderSeparator = () => {
        return <View style={[GlobalStyles.horLine, styles.horLine]} />;
    }

    render(){
        const { loading, ready, refreshing, businessInfo, isCollect, service } = this.state;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'门店服务点'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {service}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderCompanyItem(item)}
                        onRefresh = {this.loadNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
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
        backgroundColor: '#fff',
    },
    scrollContainer: {
        marginTop: 10,
    },
    addressItemView: {
        height: 45,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    horLine: {
        backgroundColor: '#ddd',
    },
    shopPlaceIcon: {
        width: 15,
        height: 15,
        marginLeft: 6,
        resizeMode: 'contain',
    },
});
