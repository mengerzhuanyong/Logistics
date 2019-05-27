/**
 * 速芽物流用户端 - MineAddressAdd
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import Picker from 'react-native-picker'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort} from '../../util/utilsToast'

import ShopData from '../../asset/json/homeBusiness.json'
import area from '../../asset/json/area.json'

const selectedIcon = GlobalIcons.icon_checked;
const selectIcon = GlobalIcons.icon_check;

export default class MineAddressAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: global.user ? global.user.userData.uid : '',
            style: ',2,',
            phone: '',
            name: '',
            area: [],
            address: '',
            other: false,
            ready: false,
            loadMore: false,
            refreshing: false,
            canPress: true,
            companyListData: ShopData.data,
            canBack: false,
            addressName: '',
            longitude: '',
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        this.loadNetData();
        if (global.user) {
            this.updateState({
                uid: global.user.userData.uid
            });
        }
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount() {
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

    doSubmitAdd = () => {
        let url = NetApi.mineAddressAdd;
        let {uid, phone, area, style, name, address, other, addressName, longitude} = this.state;
        let status = other ? ',1,2,' : style;
        let data = {
            uid: uid,
            phone: phone,
            style: status,
            name: name,
            area: area,
            address: address,
            other: other,
            address_name: addressName,
            longitude,
        };
        if (name === '') {
            toastShort('请输入收件人姓名');
            return;
        }
        if (phone === '') {
            toastShort('请输入收件人电话');
            return;
        }
        // if (area.length == 0) {
        //     toastShort('请选择所在城市');
        //     return;
        // }
        // if (address == '') {
        //     toastShort('请选择地点');
        //     return;
        // }
        this.updateState({
            canPress: false
        });
        this.netRequest.fetchPost(url, data, true)
            .then(result => {
                toastShort('添加成功');
                this.timer = setTimeout(() => {
                    this.onBack();
                }, 500);
                // console.log('地址添加', result);
            })
            .catch(error => {
                toastShort('error');
                this.updateState({
                    canPress: true
                });
                // console.log('登录出错', error);
            })
    }

    dropLoadMore = () => {
    }

    freshNetData = () => {
    }

    createAreaData = () => {
        let data = [];
        let len = area.length;
        for (let i = 0; i < len; i++) {
            let city = [];
            let cityLen = area[i]['city'].length;
            for (let j = 0; j < cityLen; j++) {
                let district = {};
                district[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(district);
            }

            let province = {};
            province[area[i]['name']] = city;
            data.push(province);
        }
        return data;
    }

    onPressSelectAddress = () => {
        this.props.navigation.navigate('SelectAddressWeb', {
            onCallBack: (address, longitude, addressName) => this.setState({
                address,
                longitude,
                addressName,
            })
        });
    };

    showAreaPicker = (type) => {
        Picker.init({
            pickerData: this.createAreaData(),
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '地区选择',
            selectedValue: [],
            onPickerConfirm: pickedValue => {
                this.updateState({
                    area: pickedValue
                })
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {
                this.updateState({
                    area: pickedValue
                })
            }
        });
        Picker.show();
    };

    render() {
        const {ready, refreshing, companyListData, area, address, canPress} = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'新增地址'}
                    leftButton={UtilsView.getLeftButton(() => {
                        this.state.canBack && this.onBack()
                    })}
                />
                <KeyboardAwareScrollView>
                    <CustomKeyboard.AwareCusKeyBoardScrollView>
                        <View style={[styles.addressAddItemView]}>
                            <TextInput
                                style={styles.inputItemCon}
                                placeholder="请输入联系人姓名"
                                placeholderTextColor='#555'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({
                                        name: text
                                    })
                                }}
                            />
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            <CustomKeyboard.CustomTextInput
                                maxLength={11}
                                style={styles.inputItemCon}
                                placeholder="请输入联系电话"
                                placeholderTextColor='#555'
                                customKeyboardType="numberKeyBoard"
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({
                                        phone: text
                                    })
                                }}
                            />
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            <TouchableOpacity
                                style={styles.inputItemConView}
                                onPress={() => this.showAreaPicker()}
                            >
                                <Text
                                    style={[styles.inputItemCon, {lineHeight: 45}]}>{area.length > 0 ? `${area[0]} ${area[1]} ${area[2]}` : '选择省市区（选填）'}</Text>
                            </TouchableOpacity>
                            <View style={[GlobalStyles.horLine, styles.horLine]}/>
                            <TextInput
                                style={styles.inputItemCon}
                                placeholder="请输入详细地址（选填）"
                                placeholderTextColor='#555'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({
                                        address: text
                                    })
                                }}
                            />
                        </View>
                        {/*<TouchableOpacity
                            style = {[styles.addressAddItemView, styles.addressAddTips]}
                            onPress = {() => {
                                this.updateState({
                                    other: !this.state.other
                                })
                            }}
                        >
                            <Text style={styles.addressAddTipsName}>保存到我的发货地址</Text>
                            <Image source={this.state.other ? selectedIcon : selectIcon} style={GlobalStyles.checkedIcon} />
                        </TouchableOpacity>*/}
                        <View style={[GlobalStyles.btnView, styles.btnView]}>
                            <TouchableOpacity
                                style={GlobalStyles.btnView}
                                onPress={() => {
                                    canPress && this.doSubmitAdd()
                                }}
                            >
                                <Text style={GlobalStyles.btnItem}>立即添加</Text>
                            </TouchableOpacity>
                        </View>
                    </CustomKeyboard.AwareCusKeyBoardScrollView>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    horLine: {
        marginVertical: 5,
    },
    addressAddItemView: {
        padding: 15,
        backgroundColor: '#fff',
    },
    inputItemConView: {
        height: 45,
        justifyContent: 'center',
    },
    inputItemCon: {
        height: 45,
        fontSize: 15,
        color: '#555',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputItemConText: {
        fontSize: 15,
        color: '#555',
    },
    addressAddTips: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressAddTipsName: {
        fontSize: 15,
        color: '#555',
    },
    fixedBtnView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },
    btnView: {
        borderRadius: 5,
    },
    btnItem: {
        fontSize: 18,
    },
});