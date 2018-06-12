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
    TouchableOpacity
} from 'react-native'

import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import { toastShort, consoleLog } from '../../util/utilsToast'

export default class MineInfoSetting extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            user: params.user ? params.user : global.user,
            uid: params.user ? params.user.uid : '',
            userName: params.user ? params.user.username : '',
            loading: false,
            canPress: true,
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
        
    }

    submitChange = () => {
        let { uid, userName } = this.state;
        let url = NetApi.mineName;
        let data = {
            uid: uid,
            username: userName,
        };
        this.updateState({
            canPress: false
        })
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == 1) {
                    toastShort(result.msg);                    
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 1000);
                }else{
                    toastShort(result.msg);
                }
                // console.log('修改手机号', result);
            })
            .catch( error => {
                toastShort('服务器请求失败，请稍后重试！');
                this.updateState({
                    canPress: true
                })
                // console.log('登录出错', error);
            })
    }

    renderRightButton = () => {
        let {canPress} = this.state;
        return (
            <TouchableOpacity
                style = {GlobalStyles.rightButton}
                onPress = {() => {canPress && this.submitChange()}}
            >
                <Text style={GlobalStyles.rightButtonName}>保存</Text>
            </TouchableOpacity>
        )
    }


    render(){
        let { loading, userName } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'昵称设置'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    rightButton = {this.renderRightButton()}
                />
                <View style={[styles.mineInfoItemView]}>
                    <Text style={[styles.mineInfoItemTitle]}>昵称</Text>
                    <TextInput
                        style = {styles.inputItemCon}
                        placeholder = "请输入用户昵称"
                        placeholderTextColor = '#888'
                        defaultValue = {userName}
                        underlineColorAndroid = {'transparent'}
                        onChangeText = {(text)=>{
                            this.setState({
                                userName: text
                            })
                        }}
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
    inputItemConView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    inputItemCon: {
        height: 45,
        color: '#777',
        textAlign: 'right',
        flex: 1,
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
