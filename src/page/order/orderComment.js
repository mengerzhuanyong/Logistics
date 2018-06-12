/**
 * 速芽物流用户端 - OrderComment
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
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

const selected = GlobalIcons.icon_star_red;
const unselected = GlobalIcons.icon_star_gray;

export default class OrderComment extends Component {

    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state;
        // console.log(params);
        this.state =  {
            rank: 4,
            user: global.user ? global.user.userData : '',
            commentText: '',
            item: params.item ? params.item : '',
            orderid: params.orderid ? params.orderid : '',
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
    }

    componentDidMount(){
        this.loadNetData();
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        this.timer && clearTimeout(this.timer);
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

    loadNetData = () => {
        if (global.user.loginState) {
            this.updateState({
                user: global.user.userData,
            });
        }
    }

    doSubmitComment = () => {
        let url = NetApi.orderComment;
        let { user, rank, item, commentText } = this.state;
        let data = {
            uid: user.uid,
            sid: item.sid,
            oid: item.id,
            count: commentText,
            score: rank,
        };
        // // console.log(data);
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == 1) {
                    // console.log('评价成功', result);
                    toastShort(result.msg);
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 500);
                } else {
                    toastShort(result.msg);
                }
                    
            })
            .catch( error => {
                toastShort('网络请求失败，请稍后再试！');
                // console.log('评价失败', error);
            })
    }

    selectRank = (rank) => {
        this.updateState({
            rank: rank
        })
    }

    render(){
        const { item, rank } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'订单评价'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <ScrollView style={styles.container}>
                    <View style={[styles.commentItemView, styles.commentOrderInfoView]}>
                        <Image source={GlobalIcons.banner1} style={styles.commentOrderImage} />
                        <View style={styles.commentCompanyView}>
                            <View style={styles.commentCompanyInfoItem}>
                                <Text style={styles.commentCompanyName}>{item.storeName}</Text>
                            </View>
                            <View style={styles.commentCompanyInfoItem}>
                                <View style={styles.commentCompanyInfoLeftView}>

                                    <Text style={styles.commentCompanyInfoConText}>发货班次：</Text>
                                    <Text style={styles.commentCompanyInfoConText}>{item.service}</Text>
                                </View>
                                <View style={styles.commentCompanyInfoRightView}>
                                    <Text style={styles.commentCompanyInfoConText}>{item.time}</Text>
                                </View>
                            </View>
                            <View style={styles.commentCompanyInfoItem}>
                                <Text style={styles.commentCompanyInfoConText}>订单价格：</Text>
                                <Text style={styles.commentCompanyInfoMoney}>¥ {parseFloat(item.price).toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.commentItemView, styles.commentStarInfoView]}>
                        <Text style={styles.commentStarInfoTitle}>星级评价</Text>
                        <View style={styles.commentStarConView}>
                            <TouchableOpacity
                                style = {styles.commentStarItem}
                                onPress = { ()=> this.selectRank(1)}
                            >
                                <Image source={rank > 0 ? selected : unselected} style={styles.commentStarIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = {styles.commentStarItem}
                                onPress = { ()=> this.selectRank(2)}
                            >
                                <Image source={rank > 1 ? selected : unselected} style={styles.commentStarIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = {styles.commentStarItem}
                                onPress = { ()=> this.selectRank(3)}
                            >
                                <Image source={rank > 2 ? selected : unselected} style={styles.commentStarIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = {styles.commentStarItem}
                                onPress = { ()=> this.selectRank(4)}
                            >
                                <Image source={rank > 3 ? selected : unselected} style={styles.commentStarIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style = {styles.commentStarItem}
                                onPress = { ()=> this.selectRank(5)}
                            >
                                <Image source={rank > 4 ? selected : unselected} style={styles.commentStarIcon} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.commentStarGrade}>{rank}.0</Text>
                    </View>
                    <View style={[styles.commentItemView, styles.commentContextView]}>
                        <TextInput
                            style = {styles.inputItemCon}
                            multiline = {true}
                            placeholder = "填写您的评价..."
                            placeholderTextColor = '#888'
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    commentText: text
                                })
                            }}
                        />
                    </View>
                    <View style={GlobalStyles.btnView}>
                        <TouchableOpacity
                            style = {GlobalStyles.btnView}
                            onPress = {() => {this.doSubmitComment()}}
                        >
                            <Text style={GlobalStyles.btnItem}>提交</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    commentItemView: {
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    commentOrderInfoView: {},
    commentOrderImage: {
        width: 80,
        height: 80,
        marginRight: 15,
        resizeMode: 'cover',
    },
    commentCompanyView: {
        flex: 1,
        height: 80,
        justifyContent: 'space-around',
    },
    commentCompanyInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentCompanyName: {
        fontSize: 16,
        color: '#333',
    },
    commentCompanyInfoLeftView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentCompanyInfoConText: {
        fontSize: 13,
        color: '#555',
    },
    commentCompanyInfoRightView: {},
    commentCompanyInfoMoney: {
        fontSize: 16,
        color: '#f60',
    },
    commentStarInfoView: {},
    commentStarInfoTitle: {},
    commentStarConView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentStarItem: {
        width: 35,
        height: 35,
        marginHorizontal: 5,
    },
    commentStarIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    commentStarGrade: {
        fontSize: 16,
        color: GlobalStyles.themeColor,
    },
    commentContextView: {},
    inputItemCon: {
        height: 120,
    },
});
