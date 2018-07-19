/**
 * 速芽物流用户端 - MineAddressItem
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
import ModalView from '../../util/utilsDialogs'

const selectedIcon = GlobalIcons.icon_checked;
const selectIcon = GlobalIcons.icon_check;
const MODAL_CONFIG = {
    title: '删除地址',
    modalText: '您确认删除该地址吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};

export default class MineAddressItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            show: false,
            item: this.props.item,
            style: this.props.style,
            PAGE_FLAG: this.props.PAGE_FLAG,
            updateContent: this.props.updateContent,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        item: {},
        PAGE_FLAG: '',
        updateContent: () => {}
    };

    componentDidMount() {
        // console.log("接受参数", this.props.item);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.item != nextProps.item) {
    //         return true;
    //     }
    //     return false;
    // }

    componentWillReceiveProps(nextProps){
        this.updateState({
            item: nextProps.item
        })
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    updateState = (state) => {
        if (!this) { return };
        this.setState(state);
    }

    loadNetData = () => {

    }

    setDefaultAddress = (item) => {
        const { updateContent } = this.state;
        let url = NetApi.mineAddressDefault + item.id + '/uid/' + global.user.userData.uid;
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code == 1) {
                    updateContent('address', item);
                    this.props.navigation.goBack();
                } else {
                    toastShort(result.msg);
                }
            })
            .catch( error => {
                toastShort('error');
            })
    }

    showModalView = () => {
        this.updateState({
            show: !this.state.show
        })
    }

    submitAddressDel = (data) => {
        // // console.log(data);
        let url = NetApi.mineAddressDel + data + '/style/' + this.state.style;
        this.netRequest.fetchGet(url)
            .then( result => {
                // console.log('删除成功', result);
                if (result && result.code == 1) {
                    // toastShort(result.msg);
                    this.updateState({
                        show: !this.state.show
                    });
                    this.timer = setTimeout(() => {
                        this.props.reloadData();
                    },50)
                } else {
                    this.updateState({
                        show: !this.state.show
                    })
                }
            })
            .catch( error => {
                toastShort('error');
            })
        // console.log(url);
        // toastShort('result.msg');
        // this.updateState({
        //     show: !this.state.show
        // });
        // this.timer = setTimeout(() => {
        //     this.props.reloadData();
        // },50)
    }

    render(){
        const { onPushNavigator, leftIcon, leftTitle, rightText, onPushToAddressEdit, onPushToAddressDel, manageAddress } = this.props;
        const { item, PAGE_FLAG, updateContent, show } = this.state;
        return (
            <View style={styles.container}>
                {PAGE_FLAG == 'FLOW' &&
                    <TouchableOpacity
                        style = {styles.addressSelectView}
                        onPress = {() => this.setDefaultAddress(item)}
                    >
                        <Image source={item.is_default == 1 ? selectedIcon : selectIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                }
                <View style={styles.addressInfoView}>
                    {PAGE_FLAG == 'FLOW' ?
                        <TouchableOpacity onPress = {() => this.setDefaultAddress(item)}>
                            <View style={styles.addressInfoItem}>
                                <Text style={styles.addressInfoName}>{item.name}</Text>
                                <Text style={styles.addressInfophone}>{item.phone}</Text>
                            </View>
                            <View style={styles.addressInfoItem}>
                                <Text style={styles.addressInfoDetail}>{item.address_detail}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <View>
                            <View style={styles.addressInfoItem}>
                                <Text style={styles.addressInfoName}>{item.name}</Text>
                                <Text style={styles.addressInfophone}>{item.phone}</Text>
                            </View>
                            <View style={styles.addressInfoItem}>
                                <Text style={styles.addressInfoDetail}>{item.address_detail}</Text>
                            </View>
                        </View>
                    }
                    {manageAddress && <View style={[GlobalStyles.horLine, styles.horLine]} />}
                    {manageAddress &&
                        <View style={styles.addressBtnView}>
                            <TouchableOpacity
                                onPress = {onPushToAddressEdit}
                                style={styles.addressBtnItemView}
                            >
                                <Image source={GlobalIcons.icon_edit} style={styles.addressBtnIcon} />
                                <Text style={styles.addressBtnItemName}>编辑</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress = {() => this.showModalView()}
                                style={styles.addressBtnItemView}
                            >
                                <Image source={GlobalIcons.icon_trash} style={styles.addressBtnIcon} />
                                <Text style={styles.addressBtnItemName}>删除</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <ModalView
                        show = {show}
                        title = {MODAL_CONFIG.title}
                        contentText = {MODAL_CONFIG.modalText}
                        cancelBtnName = {MODAL_CONFIG.cancelBtnName}
                        confirmBtnName = {MODAL_CONFIG.confirmBtnName}
                        cancelFoo = {() => this.showModalView()}
                        confirmFoo = {() => this.submitAddressDel(item.id)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: 'gray',
        shadowOffset: {
            width: 0.5,
            height: 0.5
        },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    addressSelectView: {
        width: 40,
        height: 50,
        // alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#123',
    },
    horLine: {
        marginVertical: 5,
    },
    addressInfoView: {
        flex: 1,
    },
    addressInfoItem: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    addressInfoName: {
        fontSize: 16,
        color: '#333',
    },
    addressInfophone: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
    },
    addressInfoDetail: {
        fontSize: 13,
        color: '#555',
    },
    addressBtnView: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    addressBtnItemView: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressBtnItemName: {
        fontSize: 13,
        color: '#666',
    },
    addressBtnIcon: {
        width: 15,
        height: 15,
        marginHorizontal: 5,
    },
});