/**
 * 速芽物流用户端 - BusinessItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    PixelRatio,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import { toastShort, consoleLog } from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import ShopRankView from './shopRankView'
import ShopTagsView from './shopTagsView'

export default class BusinessItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            tagsPosition: false,
            item: this.props.item.item,
            index: this.props.item.index,
            titleWidth: '',
            nameWidth: '',
            tagsWidth: '',
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        // item: HomeNavigation
        item: '',
        index: '',
        onSetModal: () => {},
    }

    componentDidMount() {
        // console.log("参数传递", this.props.item);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.item != nextState.item.item) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps){
        // console.log(nextProps);
        this.updateState({
            item: nextProps.item.item
        })
    }

    updateState = (state) => {
        if (!this) {
            return
        }
        this.setState(state);
    };

    loadNetData = () => {
        
    }

    renderShopServices = (data) => {
        if(data.length <= 0) {
            return;
        }
        let routers = data.map((obj,index)=>{
            return (
                <Text key = {"service"+index} style={styles.shopRouterCon}>{obj.router}</Text>
            )
        });
        return routers;
    }

    onSubmitSearch = (item, disinfo) => {
        const { navigate } = this.props.navigation;
        navigate('BusinessServiceList', {
            item: item,
            start: '',
            end: '',
            disinfo: disinfo,
            pageTitle: 'pageTitle',
            reloadData: () => this.loadNetData(),
        });
    }

    onLayoutView = (event) => {
        //获取根View的宽高，以及左上角的坐标值
        let {x, y, width, height} = event.nativeEvent.layout;
        // console.log('onLayoutView',width);
        this.setState({
            titleWidth: width
        }, () => {this.renderShopTitle()});
        
        // if (width > 140) {
        //     this.updateState({
        //         tagsPosition: true,
        //     })
        // } else {
        //     this.updateState({
        //         tagsPosition: false,
        //     })
        // }
    }

    onLayoutText = (event) => {
        //获取根View的宽高，以及左上角的坐标值
        let {x, y, width, height} = event.nativeEvent.layout;
        // console.log('onLayoutText',width);
        this.setState({
            nameWidth: width
        }, () => {this.renderShopTitle()});
        
        // if (width > 60) {
        //     this.updateState({
        //         tagsPosition: true,
        //     })
        // } else {
        //     this.updateState({
        //         tagsPosition: false,
        //     })
        // }
    }

    onLayoutTags = (event) => {
        //获取根View的宽高，以及左上角的坐标值
        let {x, y, width, height} = event.nativeEvent.layout;
        // console.log('onLayoutTags',width);
        this.setState({
            tagsWidth: width
        }, () => {this.renderShopTitle()});
        
        // if (width > 140) {
        //     this.updateState({
        //         tagsPosition: true,
        //     })
        // } else {
        //     this.updateState({
        //         tagsPosition: false,
        //     })
        // }
    }

    renderShopTitle = () => {
        let {titleWidth, nameWidth, tagsWidth, tagsPosition, item} = this.state;
        // console.log(item.name,'-----', titleWidth, nameWidth, tagsWidth);
        let widthStatus = titleWidth - nameWidth - tagsWidth;
        if (widthStatus >= 0) {
            this.updateState({
                tagsPosition: false
            });
        } else {
            this.updateState({
                tagsPosition: true
            });
        }
    };

    renderFeatures = (data) => {
        if (data.length < 1) {
            return;
        }
        // data = [
        //     {router: '零担'},
        //     {router: '整车'},
        // ];
        let features = data.map((obj, index) => {
            return (
                <View key={"service"+index} style={styles.featuresItem}>
                    <Text style={styles.featuresItemName}>{obj.router}</Text>
                </View>
            );
        });
        return features;
    };

    render(){
        const { item, index, tagsPosition } = this.state;
        const { onPushToBusiness, onSetModal } = this.props;
        // console.log(item);
        return (
            <TouchableOpacity
                style = {styles.container}
                onPress = {onPushToBusiness}
            >
                <View style={styles.shopAlbumView}>
                    {item.istop == 1 && <Image source={GlobalIcons.icon_top} style={styles.shopTopIcon} />}
                    <Image source={item.logo != '' ? {uri: item.logo} : GlobalIcons.banner1} style={styles.shopThumbnail} />
                </View>
                <View style={styles.shopInfoView} onLayout={(event) => this.onLayoutView(event)} >
                    {/*this.renderShopTitle(tagsPosition, item)*/}
                    <View style={[styles.shopInfoItem]}>
                        <Text style={[styles.shopName]} numberOfLines={2} onLayout={(event) => this.onLayoutText(event)}>{item.name}</Text>
                        {!tagsPosition && GlobalStyles.width >= 360 && <ShopTagsView onSetModal={() => onSetModal()} tags={item.tags} page_flage={'list'} onLayout={(event) => this.onLayoutTags(event)} />}
                    </View>
                    {(tagsPosition || GlobalStyles.width < 359) && <View style={[styles.shopInfoItem, {flex: 1,}]}>
                        <ShopTagsView onSetModal={() => onSetModal()} tags={item.tags} page_flage={'list'} onLayout={(event) => this.onLayoutTags(event)} />
                    </View>}
                    {GlobalStyles.width < 359 && <View style={styles.shopInfoItem}>
                        <Text style={styles.shopDistance}>{item.distance}</Text>
                    </View>}
                    <View style={styles.shopInfoItem}>
                        <ShopRankView star={item.star} />
                        {GlobalStyles.width >= 360 && <Text style={styles.shopDistance}>{item.distance}</Text>}
                    </View>
                    {item.disinfo !== '' && <View style={styles.shopInfoItem}>
                        <View style={styles.shopDiscountView}>
                            <View style={styles.shopDiscountTitleView}>
                                <Text style={styles.shopDiscountTitle}>惠</Text>
                            </View>
                            <Text style={styles.shopDiscountCon}>{item.disinfo}</Text>
                        </View>
                    </View>}
                    {1 > 2 && <View style={styles.shopInfoItem}>
                        <View style={styles.shopRouterView}>
                            {this.renderShopServices(item.service)}
                        </View>
                        <TouchableOpacity
                            style = {styles.shopRouterBtn}
                            onPress = {() => this.onSubmitSearch(item, item.disinfo)}
                        >
                            <Text style={styles.shopRouterBtnItem}>更多路线</Text>
                        </TouchableOpacity>
                    </View>}
                    <View style={[styles.shopInfoItem, styles.featuresView]}>
                        {this.renderFeatures(item.service)}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // height: 160,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    shopAlbumView: {
        width: 110,
        height: 110,
        overflow: 'hidden',
        position: 'relative',
    },
    shopTopIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        zIndex: 2,
        height: 40,
        resizeMode: 'contain',
    },
    shopThumbnail: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
        backgroundColor: '#fefefe'
    },
    shopInfoView: {
        // width: GlobalStyles.width - 200,
        flex: 1,
        // marginTop: 5,
        // overflow: 'hidden',
        // height: 140,
        marginLeft: 10,
    },
    shopInfoItem: {
        flex: 1,
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shopName: {
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
    shopTagsView: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    shopTagsIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    shopTagsNameView: {
        width: 20,
        height: 20,
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: GlobalStyles.themeColor,
    },
    shopTagsName: {
        fontSize: 12,
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
        color: GlobalStyles.themeColor,
    },
    shopStarView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopStarTitle: {
        color: '#333',
    },
    shopStarCon: {},
    shopStarIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    shopStarNum: {
        marginLeft: 10,
        color: '#f00',
    },
    shopDistance: {
        fontSize: 12,
        color: '#888',
    },
    shopDiscountView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopDiscountTitleView: {
        padding: 2,
        borderWidth: 1,
        marginRight: 5,
        borderColor: '#080',
    },
    shopDiscountTitle: {
        fontSize: 10,
        color: '#080',
    },
    shopDiscountCon: {
        fontSize: 13,
        color: '#080',
    },
    shopRouterView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopRouterCon: {
        color: '#888'
    },
    shopRouterBtn: {},
    shopRouterBtnItem: {
        fontSize: 13,
        color: GlobalStyles.themeColor
    },
    featuresView: {
        // flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    featuresItem: {
        marginVertical: 3,
        marginRight: 3,
        borderWidth: 1 / PixelRatio.get(),
        borderRadius: 2,
        borderColor: GlobalStyles.themeColor,
        paddingVertical: 1,
        paddingHorizontal: 2,
    },
    featuresItemName: {
        fontSize: 12,
        color: GlobalStyles.themeColor,
    },
});