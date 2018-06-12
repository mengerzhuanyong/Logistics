/**
 * 速芽物流用户端 - MINE
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native'
import Spinner from 'react-native-spinkit'
import NetRequest from '../../util/utilsRequest'
import ActionSheet from 'react-native-actionsheet'
import SYImagePicker from 'react-native-syan-image-picker'
import { NavigationActions } from 'react-navigation'
import {ACTION_MINE} from '../../constant/EventActions'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'
import NavigatorItem from '../../component/mine/navigatorItem'
import NavigationsData from '../../asset/json/systemNavigations.json'

const ACTION_CONFIG = {
    CANCEL_INDEX: 0,
    DESTRUCTIVE_INDEX: 1,
    options: ['取消', '确定'],
    title: '您确定要退出吗？',
};

export default class Mine extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            user: global.user ? global.user.userData : '',
            couponNums: '0',
            loginState: '',
            isRefreshing: false,
            uploading: false,
            navigations: NavigationsData.data.mineNavigations,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        user: {
            uid: global.user ? global.user.userData.uid : '',
        }
    };

    componentDidMount(){
        this.getNavigations();
        this.loadNetData();
        this.listener = DeviceEventEmitter.addListener('ACTION_MINE',
            (action, params) => this.onAction(action, params));
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
        this.listener && this.listener.remove();
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

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onAction(action, params) {
        if (ACTION_MINE.A_RESTART === action) {
            this.onRefreshing();
            // this.loadNetData();
        }
    }

    onRefreshing = () => {
        if (!global.user.loginState) {
            return false;
        }
        this.loadNetData();
    }

    loadNetData = () => {
        // consoleLog(global.user);
        if (!global.user.loginState) {
            return;
        }else{
            let { userData, loginState } = global.user;
            this.updateState({
                // user: userData,
                loginState: loginState,
            })
            this.getNetData(userData);
        }
    }

    getNetData = (user) => {
        // console.log('本地用户信息', user);
        let url = NetApi.mine + user.uid;
        this.netRequest.fetchGet(url)
            .then( result => {
                this.updateState({
                    user: result.data.userInfo,
                    couponNums: result.data.couponNums,
                    isRefreshing: false,
                })
                // console.log('详情页', result.data.couponNums);
            })
            .catch( error => {
                // console.log('详情页', error);
            })
    }

    getNavigations = () => {
        let url = NetApi.navigations;
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code == 1) {
                    this.updateState({
                        navigations: result.data.mineNavigations
                    })
                }
                // console.log('首页推荐', result);
            })
            .catch( error => {
                // console.log('首页推荐', error);
            })
    }

    onPushNavigator = (pageTitle, compent) => {
        let { user, loginState } = this.state;
        const { navigate } = this.props.navigation;
        if (loginState) {
            navigate(compent, {
                user: user,
                pageTitle: pageTitle,
                reloadData: () => this.loadNetData(),
            })
        }else{
            navigate('Login')
        }
    }

    handleOpenImagePicker = () => {
        SYImagePicker.removeAllPhoto();
        SYImagePicker.showImagePicker({imageCount: 1, isRecordSelected: true, enableBase64: true}, (err, img) => {
            // console.log(img);
            if (!err) {
                this.setState({
                    uploading: true,
                }, () => this.uploadImages(img[0].base64));
            }
        })
    };

    uploadImages = (source) => {
        let {user} = this.state;
        let url = NetApi.mineUploadAvatar;
        let data = {
            image: source,
            uid: user.uid,
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                user.avatar = source;
                this.updateState({
                    user: user,
                    uploading: false,
                })
                // console.log(result);
            })
            .catch(error => {
                // console.log(error);
            })
    };

    renderUserInfo = (user) => {
        let {uploading} = this.state;
        return (
            <View style={styles.mineInfoView}>
                <TouchableOpacity
                    style = {styles.userPhotoView}
                    onPress = {()=>this.handleOpenImagePicker()}
                >
                    {uploading ?
                        <Spinner style={styles.spinner} isVisible={uploading} size={50} type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                        :
                        <Image style={styles.userPhoto} source={user.avatar ? {uri: user.avatar} : GlobalIcons.images_user_photo} />
                    }                    
                </TouchableOpacity>
                <View style={styles.userInfoDetail}>
                    <Text style={styles.userInfoName}>{user.username}</Text>
                    {1 > 2 &&<TouchableOpacity
                        style = {styles.userInfoSetting}
                        onPress = {()=>this.onPushNavigator('个人信息', 'MineInfoSetting')}
                    >
                        <Text style={styles.userInfoSettingName}>个人信息 ></Text>
                    </TouchableOpacity>}
                </View>
                <TouchableOpacity style={styles.userSettingView} onPress = {()=>this.onPushNavigator('个人信息', 'MineInfoSetting')}>
                    <Image style={styles.settingIcon} source={GlobalIcons.icon_setting} />
                </TouchableOpacity>
            </View>
        )
    }

    renderLoginView = () => {
        return (
            <View style={styles.mineInfoView}>
                <View style={styles.userPhotoView}>
                    <TouchableOpacity
                        onPress = {()=>this.onPushNavigator('登录', 'Login')}
                    >
                        <Image style={styles.userPhoto} source={GlobalIcons.images_user_photo} />
                    </TouchableOpacity>
                </View>
                <View style={styles.userInfoDetail}>
                    <TouchableOpacity
                        style = {styles.userInfoSetting}
                        onPress = {()=>this.onPushNavigator('登录', 'Login')}
                    >
                        <Text style={[styles.userInfoName, GlobalStyles.f_w4]}>登录 / 注册</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    doLogOut = (index) => {
        if (index === 1) {
            let url = NetApi.logOut;
            this.netRequest.fetchGet(url)
                .then( result => {
                    // // console.log(result);
                    this.removeLoginState();
                    if (result && result.code == 1) {
                        toastShort("退出成功");
                    }
                })
                .catch( error => {
                    // console.log('退出失败，请重试！', error);
                })
        }

    }

    removeLoginState = () => {
        storage.remove({
            key: 'loginState',
        });
        global.user.loginState = false;
        global.user.userData = '';
        this.timer = setTimeout(() => {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'TabNavScreen'})
                ]
            })
            this.props.navigation.dispatch(resetAction)
        }, 500);
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    render(){
        let { user, navigations, loginState, couponNums, isRefreshing } = this.state;
        // couponNums = parseInt(couponNums);
        // console.log('优惠券数量', couponNums);
        return (
            <ScrollView
                style={styles.container}
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
                <View style={styles.mineTopContainer}>
                    <Image style={styles.backgroundImages} source={GlobalIcons.images_bg_user} />
                    {loginState ? this.renderUserInfo(user) : this.renderLoginView()}
                </View>
                <View style={styles.mineNavigatorContainer}>
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_coupon}
                        leftTitle = {navigations.coupon}
                        rightText = {couponNums}
                        onPushNavigator = {() => this.onPushNavigator(navigations.coupon, 'MineCoupon')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_collect_red}
                        leftTitle = {navigations.collect}
                        onPushNavigator = {() => this.onPushNavigator(navigations.collect, 'MineCollect')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_mine_order}
                        leftTitle = {navigations.my_order}
                        onPushNavigator = {() => this.onPushNavigator(navigations.my_order, 'Order')}
                    />
                </View>
                <View style={styles.mineNavigatorContainer}>
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_address_send}
                        leftTitle = {navigations.ship}
                        onPushNavigator = {() => this.onPushNavigator(navigations.ship, 'MineAddressShipperList')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_address_receive}
                        leftTitle = {navigations.receive}
                        onPushNavigator = {() => this.onPushNavigator(navigations.receive, 'MineAddressList')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine, {height: 1}]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_feedback}
                        leftTitle = {navigations.user_back}
                        onPushNavigator = {() => this.onPushNavigator(navigations.user_back, 'MineFeedBack')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_feedback2}
                        leftTitle = {navigations.user_back2}
                        onPushNavigator = {() => this.onPushNavigator(navigations.user_back2, 'MineFeedBackReward')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_about}
                        leftTitle = {navigations.about}
                        onPushNavigator = {() => this.onPushNavigator(navigations.about, 'MineAbout')}
                    />
                </View>
                {loginState ?
                    <View style={styles.mineBtnView}>
                        <TouchableOpacity
                            style = {GlobalStyles.btnView}
                            onPress = {() => {this.showActionSheet()}}
                        >
                            <Text style={GlobalStyles.btnItem}>退出账户</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                }
                <View style = {styles.wrapper}>
                    <ActionSheet
                        ref = {o => this.ActionSheet = o}
                        title = {ACTION_CONFIG.title}
                        options = {ACTION_CONFIG.options}
                        cancelButtonIndex = {ACTION_CONFIG.CANCEL_INDEX}
                        destructiveButtonIndex = {ACTION_CONFIG.DESTRUCTIVE_INDEX}
                        onPress = {this.doLogOut}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    horLine: {
        marginVertical: 8,
    },
    mineTopContainer: {
        height: GlobalStyles.width * 0.4,
        paddingBottom: 10,
        position: 'relative',
        backgroundColor: '#fff',
    },
    backgroundImages: {
        position: 'absolute',
        top: -(GlobalStyles.width * 0.15),
        width: GlobalStyles.width,
        height: GlobalStyles.width * 0.55,
    },
    mineInfoView: {
        paddingVertical: 40,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
    },
    userPhotoView: {
        width: 80,
        height: 80,
        borderWidth: 5,
        marginRight: 25,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderColor: GlobalStyles.themeDeepColor,
    },
    userPhoto: {
        // margin: 5,
        width: 70,
        height: 70,
        borderRadius: 35,
        resizeMode: 'cover',
        // backgroundColor: '#123',
    },
    userInfoDetail: {
        height: 70,
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
        // backgroundColor: '#123',
    },
    userInfoName: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '800',
    },
    userInfoSetting: {
    },
    userInfoSettingName: {
        fontSize: 14,
        color: '#fff',
    },
    userSettingView: {
        position: 'absolute',
        top: 50,
        right: 15,
    },
    settingIcon: {
        width: 30,
        height: 30,
        tintColor: '#fff',
        resizeMode: 'contain',
    },
    mineNavigatorContainer: {
        paddingBottom: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    mineBtnView: {
        marginTop: 20,
        marginBottom: 40,
    },
});
