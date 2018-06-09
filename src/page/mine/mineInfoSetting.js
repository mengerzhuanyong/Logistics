/**
 * 速芽物流用户端 - MineInfoSetting
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
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native'
import Spinner from 'react-native-spinkit'
import * as Progress from 'react-native-progress'
import ImagePicker from 'react-native-image-picker'
import ActionSheet from 'react-native-actionsheet'
import {ACTION_MINE} from '../../constant/EventActions'

import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'

const ACTION_CONFIG = {
    CANCEL_INDEX: 0,
    DESTRUCTIVE_INDEX: 1,
    options: ['取消', '确定'],
    title: '您确定要取消该订单吗？',
};
const pickPhotoOptions = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照上传',
    chooseFromLibraryButtonTitle: '从相册选取',
    allowsEditing: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

export default class MineInfoSetting extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            user: params.user ? params.user : global.user,
            userName: params.user ? params.user.username : '',
            phone: params.user ? params.user.phone : '',
            userAvatar: params.user ? params.user.avatar : '',
            uploading: false,
            uploadProgress: 0,
            canBack: false,
        }
        this.netRequest = new NetRequest();
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
        DeviceEventEmitter.emit('ACTION_MINE', ACTION_MINE.A_RESTART);
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

    onPushNextPage = (webTitle, compent) => {
        const { navigate } = this.props.navigation;
        navigate(compent, {
            user: this.state.user,
            webTitle: webTitle,
            reloadData: () => this.loadNetData(),
        })
    }

    loadNetData = () => {
        let url = NetApi.mine + this.state.user.uid;
        this.netRequest.fetchGet(url)
            .then( result => {
                this.updateState({
                    user: result.data.userInfo,
                    userName: result.data.userInfo.username,
                    phone: result.data.userInfo.phone,
                })
            })
            .catch( error => {
                // console.log('详情页', error);
            })
    }

    uploadImages = (source) => {
        let url = NetApi.mineUploadAvatar;
        let data = {
            image: source,
            uid: 1,
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                this.updateState({
                    userAvatar: source,
                    uploading: false,
                })
                // // console.log(result);
            })
            .catch(error => {
                // console.log(error);
            })
    }

    pickerImages = () => {
        ImagePicker.showImagePicker(pickPhotoOptions, (response) => {

            // console.log('Response = ', response);

            if (response.didCancel) {
                // console.log('User cancelled image picker');
            }
            else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            }
            else {

                let source = 'data:image/jpeg;base64,' + response.data;

                this.uploadImages(source);
            }
        });
    }

    render(){
        let { user, uploading, userAvatar, userName, phone } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'个人信息设置'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {1 > 2 && <View style={[styles.mineInfoItemView, styles.mineInfoPhotoView]}>
                    <Text style={[styles.mineInfoItemTitle]}>头像</Text>
                    {uploading ?
                        <Progress.Circle size={50} showsText={true} progress={this.state.uploadProgress} color={'#555'}/>
                        :
                        <TouchableOpacity
                            onPress = {() => this.pickerImages()}
                        >
                            <Image source={userAvatar != '' ? {uri: userAvatar} : GlobalIcons.images_user_photo} style={styles.userPhoto} />
                        </TouchableOpacity>
                    }
                </View>}
                <TouchableOpacity
                    style = {[styles.mineInfoItemView, GlobalStyles.marginTop10]}
                    onPress = {() => this.onPushNextPage('昵称修改', 'MineInfoName')}
                >
                    <Text style={[styles.mineInfoItemTitle]}>昵称</Text>
                    <View style = {[styles.inputItemConView]}>
                        <Text style={[styles.inputItemConText]}>{userName}</Text>
                        <Image source={GlobalIcons.icon_angle_right_black} style={styles.arrowRightIcon} />
                    </View>
                </TouchableOpacity>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
                <TouchableOpacity
                    style = {[styles.mineInfoItemView]}
                    onPress = {() => this.onPushNextPage('昵称修改', 'MineInfoPhone')}
                >
                    <Text style={[styles.mineInfoItemTitle]}>手机</Text>
                    <View style = {[styles.inputItemConView]}>
                        <Text style={[styles.inputItemConText]}>{phone ? phone : '请完善手机号'}</Text>
                        <Image source={GlobalIcons.icon_angle_right_black} style={styles.arrowRightIcon} />
                    </View>                
                </TouchableOpacity>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
                <TouchableOpacity
                    style = {[styles.mineInfoItemView]}
                    onPress = {() => this.onPushNextPage('密码修改', 'MineInfoPwd')}
                >
                    <Text style={[styles.mineInfoItemTitle]}>密码管理</Text>
                    <View style = {[styles.inputItemConView]}>
                        <Text style={[styles.inputItemConText]}>******</Text>
                        <Image source={GlobalIcons.icon_angle_right_black} style={styles.arrowRightIcon} />
                    </View>                
                </TouchableOpacity>
                <View style = {styles.wrapper}>
                    <ActionSheet
                        ref = {o => this.ActionSheet = o}
                        title = {ACTION_CONFIG.title}
                        options = {ACTION_CONFIG.options}
                        cancelButtonIndex = {ACTION_CONFIG.CANCEL_INDEX}
                        destructiveButtonIndex = {ACTION_CONFIG.DESTRUCTIVE_INDEX}
                        onPress = {this.cancelOrder}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    horLine: {},
    mineInfoItemView: {
        padding: 15,
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    mineInfoPhotoView: {
        height: 80,
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'cover',
    },
    inputItemConView: {
        width: GlobalStyles.width / 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    inputItemConText: {
        fontSize: 14,
        color: '#555',
    },
    arrowRightIcon: {
        width: 18,
        height: 18,
        tintColor: '#888',
        resizeMode: 'contain',
    },
    btnView: {
        marginVertical: 50,
    },
    spinner: {
        marginTop: -5,
    },
});
