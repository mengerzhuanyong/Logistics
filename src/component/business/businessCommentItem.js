/**
 * 速芽物流用户端 - BusinessServicesItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import { toastShort, consoleLog } from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

import ShopData from '../../asset/json/homeBusiness.json'

export default class BusinessServicesItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            item: this.props.item.item,
            index: this.props.item.index,
            companyListData: ShopData.data,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        // item: HomeNavigation
    }

    componentDidMount() {
        // console.log("参数传递", this.props.item);
    }

    componentWillReceiveProps(nextProps){
        this.updateState({
            item: nextProps.item.item
        })
    }

    updateState = (state) => {
        if (!this) { return };
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    renderStar = (data) => {
        let stars = [];
        let length = parseInt(data, 10);
        for (var i = 0; i < length; i++) {
            let starItem = <Image key={i} source={GlobalIcons.icon_star_red} style={GlobalStyles.shopStarIcon} />;
            stars.push(starItem);
        };
        return stars;
    }

    render(){
        const { item, index, companyListData } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.commentTitleView}>
                    <View style={styles.commentUserInfo}>
                        <Image source={item.avatar ? {uri: item.avatar} : GlobalIcons.images_user_photo} style={styles.commentUserPhoto} />
                        <View style={styles.commentUserInfoCon}>
                            <Text style={styles.commentUserName}>{item.uid}</Text>
                            <View style={GlobalStyles.shopStarCon}>{this.renderStar(item.score)}<Text style={styles.starTips}>{item.score}.0</Text></View>
                        </View>
                    </View>
                    <Text style={styles.commentTime}>{item.createtime}</Text>
                </View>
                    
                <View style={styles.commentDetail}>
                    <Text style={styles.commentDetailCon}>{item.count}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    commentTitleView: {
        height: 60,
        paddingVertical: 20,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',        
    },
    commentUserInfo: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    commentUserPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        resizeMode: 'cover',
    },
    commentUserInfoCon: {
        height: 60,
        justifyContent: 'space-around',
    },
    commentUserName: {
        fontSize: 15,
        marginTop: 5,
    },
    commentStar: {},
    starTips: {
        color: '#f00',
        marginLeft: 5,
    },
    commentTime: {
        fontSize: 13,
        color: '#666',
    },
    commentDetail: {
        padding: 15,
    },
    commentDetailCon: {
        fontSize: 13,
        color: '#444',
    },
});