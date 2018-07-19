/**
 * 速芽物流用户端 - Flow
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Linking,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native'
import {Select, PullPicker} from 'teaset'
import Spinner from 'react-native-spinkit'
import SYImagePicker from 'react-native-syan-image-picker'
import * as Progress from 'react-native-progress'
import ImagePicker from 'react-native-image-picker'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {ACTION_MINE, ACTION_FLOW} from '../../constant/EventActions'
import ModalDropdown from 'react-native-modal-dropdown'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

const isIos = Platform.OS === 'ios';
const selectedIcon = GlobalIcons.icon_checked;
const selectIcon = GlobalIcons.icon_check;
const arrowRight = GlobalIcons.icon_angle_right_black;
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

export default class Flow extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        // console.log(params);
        this.state = {
            sid: params ? params.sid : '',   // 门店ID
            uid: global.user ? global.user.userData.uid : '',
            seid: params ? params.item.id : '',  // 服务ID
            shipper: '',
            receiver: '',
            style: '1',
            cargoName: '',
            volume: '',
            count: '',
            weight: '',
            cate: '2',
            charteredCar: '0',
            img1: '',
            img2: '',
            img3: '',
            substitutePickup: '0',
            substituteSend: '0',
            businessPickup: '0',
            remark: '',
            cid: '',
            coupon: '0',
            price: '0',
            relprice: '0',
            agree: '0',
            uploading: false,
            unit: {
                volumes: 'm³',
                num: '件',
                weight: 'KG',
            },
            carPrice: '',
            mobile: '',
            category: [],
            shipperAdd: '',
            receiverAdd: '',
            couponInfo: '',
            categoryText: '常规品',
            canPress: true,
            otherType: '',
            canBack: false,
            insurance: null,
            money_arr: [],
            deliveryFee: [
                {name: '取件费', value: '', is_selected: 0},
                {name: '送件费', value: '', is_selected: 0},
            ],
            premiums_link: '',
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        this.loadNetData();
        if (global.user) {
            this.setState({
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
        DeviceEventEmitter.emit('ACTION_MINE', ACTION_MINE.A_RESTART);
        DeviceEventEmitter.emit('ACTION_FLOW', ACTION_FLOW.A_RESTART);
    }

    style = '1';
    charteredCar = '0';
    price = '0';

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    selectContent = (component) => {
        const {navigate} = this.props.navigation;
        navigate(component, {
            cid: this.state.cid,
            orderPrice: this.state.relprice,
            // orderPrice: '50',
            PAGE_FLAG: 'FLOW',
            updateContent: this.updateContent,
            pageTitle: 'pageTitle',
            // reloadData: () => this.loadNetData(),
        })
    };

    onPushToNextPage = (pageTitle, page, params = {}) => {
        let {navigate} = this.props.navigation;
        navigate(page, {
            pageTitle: pageTitle,
            ...params,
        });
    };
    
    updateContent = (type, data) => {
        // console.log('传回的值', type, data);
        if (type == 'address' && data.style == 2) {
            this.setState({
                receiverAdd: data,
                receiver: data.id,
            })
        }
        if (type == 'address' && data.style == 1) {
            this.setState({
                shipperAdd: data,
                shipper: data.id,
            })
        }
        if (type == 'couponInfo') {
            _reduce = data.reduce;
            if (data.id == this.state.cid) {
                data.reduce = 0;
            }
            let relprice = parseFloat(this.state.relprice).toFixed(2) - parseFloat(data.reduce).toFixed(2);
            this.setState({
                cid: data.id,
                coupon: _reduce,
                couponInfo: data,
                relprice: relprice,
            })
        }

    }
    renderRow = (rowData) => {
        // console.log(rowData);
        return (
            <View style={styles.dropdownRow}>
                <Text style={styles.dropdownRowText}>{rowData.name}</Text>
            </View>
        );
    }
    renderButtonText = (rowData) => {
        // console.log(rowData);
        const {id, name} = rowData;
        this.setState({
            cate: id,
            categoryText: name,
        })
        return name;
    }
    loadNetData = () => {
        let url = NetApi.orderTips + this.state.seid;
        this.netRequest.fetchGet(url)
            .then(result => {
                // console.log(result);
                if (result && result.code == 1) {
                    this.setState({
                        unit: result.data.unit,
                        category: result.data.cate,
                        cate: result.data.cate_id,
                        money_arr: result.data.money_arr,
                        categoryText: result.data.cate_name,
                        mobile: result.data.service.mobile,
                        carPrice: result.data.service.carprice,
                        premiums_link: result.data.premiums_link,
                        deliveryFee: result.data.deliveryFee,
                    })
                }
                // console.log('获取成功', result);
            })
            .catch(error => {
                // console.log('获取出错', error);
            })
    };

    changeOrderStyle = (style, insurance = 0) => {
        let {deliveryFee, price} = this.state;
        if (deliveryFee && deliveryFee[0]) {
            deliveryFee[0].is_selected = 0;
        }
        if (deliveryFee && deliveryFee[1]) {
            deliveryFee[1].is_selected = 0;
        }
        this.setState({
            style,
            price,
            coupon: 0,
            deliveryFee: this.state.deliveryFee,
        })
        this.getPrices(style, insurance);
    }
    /**
     * @Author   Menger
     * @DateTime 2018-02-24
     * @return   {订单价格}
     */
    getPrices = (style, insurance = 0) => {
        let {seid, volume, deliveryFee, count, price} = this.state;
        // 取送费
        let value1 = 0;
        let value2 = 0;
        if (deliveryFee && deliveryFee[0] && deliveryFee[0].is_selected === 1) {
            value1 = deliveryFee[0].value;
        }
        if (deliveryFee && deliveryFee[1] && deliveryFee[1].is_selected === 1) {
            value2 = deliveryFee[1].value;
        }
        deliveryFeeValue = (parseFloat(value1).toFixed(2) * 100 + parseFloat(value2).toFixed(2) * 100) / 100;

        // 重置价格和状态
        this.setState({
            price: '',
            relprice: 0,
            insurance: null,
        });
        insurance = insurance != null ? insurance : 0;
        let url = NetApi.getPrice;
        let data = {
            seid: seid,
            style: style,
            volumes: volume,
            count: count,
            premiums: insurance,
            cus_prices: price,
        };
        let _insurance = insurance != '0' ? insurance : null;
        this.setState({
            insurance: _insurance,
        });
        this.netRequest.fetchPost(url, data)
            .then(result => {
                if (result && result.code == 1) {
                    let relprice = (parseFloat(result.data).toFixed(2) * 100
                                    - parseInt(this.state.coupon) * 100
                                    + parseFloat(deliveryFeeValue).toFixed(2) * 100) / 100;
                    this.setState({
                        price: result.data,
                        relprice: relprice,
                    })
                }
            })
            .catch(error => {
                // console.log('获取出错', error);
            })
    };

    changeStatus = (type, status) => {
        let state = '';
        if (status == '1') {
            state = 0;
        } else {
            state = 1
        }
        this.setState({
            type: state,
        })
        // console.log(status);
    };
    pickerImages = async () => {
        let {img1, img2, img3} = this.state;
        if (img1 != '' && img2 != '' && img3 != '') {
            toastShort("超出数量限制，请先删除一些图片");
            return;
        }

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
                if (img1 === '') {
                    this.setState({
                        uploading: true,
                    })
                }
                if (img1 != '' && img2 === '') {
                    this.setState({
                        uploading: true,
                    })
                }
                if (img1 != '' && img2 != '' && img3 === '') {
                    this.setState({
                        uploading: true,
                    })
                }

                this.uploadImages(source);
            }
        });
    }
    handleOpenImagePicker = () => {
        let {img1, img2, img3} = this.state;
        if (img1 != '' && img2 != '' && img3 != '') {
            toastShort("超出数量限制，请先删除一些图片");
            return;
        }
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
        let {img1, img2, img3} = this.state;
        let url = NetApi.orderUpload;
        let data = {
            image: source
        };
        this.netRequest.fetchPost(url, data)
            .then(result => {
                // // console.log(result);
                if (result && result.code == 1) {
                    if (img1 === '') {
                        this.setState({
                            img1: result.data,
                            uploading: false,
                        })
                    }
                    if (img1 != '' && img2 === '') {
                        this.setState({
                            img2: result.data,
                            uploading: false,
                        })
                    }
                    if (img1 != '' && img2 != '' && img3 === '') {
                        this.setState({
                            img3: result.data,
                            uploading: false,
                        })
                    }
                }

            })
            .catch(error => {
                // console.log(error);
            })
    };
    checkStatus = (data) => {
        let numberRule = /^\d+(\.\d+)?$/;
        // // console.log(data);
        if (data.shipper === '') {
            toastShort('请选择发货地址');
            return false;
        }
        if (data.receiver === '') {
            toastShort('请选择收货地址');
            return false;
        }
        if (data.style === '') {
            toastShort('请选择物品种类');
            return false;
        }
        if ((data.style == '2' || data.style == '3' || data.style == '4') && data.price <= '0') {
            toastShort('请输入订单价格');
            return false;
        }
        if (data.volume === '') {
            toastShort('请输入物品体积');
            return false;
        }
        if (data.count === '') {
            toastShort('请输入物品数量');
            return false;
        }
        if (data.weight === '') {
            toastShort('请输入物品重量');
            return false;
        }
        if (!numberRule.test(data.price)) {
            toastShort('订单价格只能输入数字，请重新输入');
            return false;
        }
        if (!numberRule.test(data.volume)) {
            toastShort('物品体积只能输入数字，请重新输入');
            return false;
        }
        if (!numberRule.test(data.count)) {
            toastShort('物品数量只能输入数字，请重新输入');
            return false;
        }
        if (!numberRule.test(data.weight)) {
            toastShort('物品重量只能输入数字，请重新输入');
            return false;
        }
        if (data.cate === '') {
            toastShort('请选择物品类型');
            return false;
        }
        if (data.img1 === '' && data.img2 === '' && data.img3 === '') {
            toastShort('请上传物品图片');
            return false;
        }
        if (data.agree != '1') {
            toastShort('请认真阅读并选择同意服务协议');
            return false;
        }
        return true;
    }
    doSubmitOrder = () => {
        let {
            sid, uid, seid, shipper, receiver, style, cargoName, volume,
            count, weight, cate, charteredCar, img1, img2, img3,
            substitutePickup, substituteSend, businessPickup, remark,
            cid, coupon, price, relprice, agree, carPrice, otherType, deliveryFee,
            insurance, money_arr
        } = this.state;
        let url = NetApi.orderSubmit;

        let data = {
            sid: sid,
            uid: uid,
            seid: seid,
            shipper: shipper,
            receiver: receiver,
            style: style,
            cargo_name: cargoName,
            volume: volume,
            count: count,
            weight: weight,
            cate: cate,
            charteredCar: charteredCar,
            img1: img1,
            img2: img2,
            img3: img3,
            substitutePickup: substitutePickup,
            substituteSend: substituteSend,
            businessPickup: businessPickup,
            remark: remark,
            cid: cid,
            coupon: coupon,
            price: price,
            relprice: relprice,
            agree: agree,
            otherType: otherType,
            deliveryFee: deliveryFee,
            premiums: insurance,
        };
        // console.log(this.checkStatus(data));
        let status = this.checkStatus(data);
        if (!status) {
            return;
        }
        this.setState({
            canPress: false,
        });
        this.netRequest.fetchPost(url, data)
            .then(result => {
                // console.log('下单成功', result);
                if (result && result.code == 1) {
                    toastShort(result.msg);
                    this.timer = setTimeout(() => {
                        this.props.navigation.navigate("OrderDetail", {
                            orderid: result.data,
                            pageTitle: '订单详情',
                            PAGE_FLAG: 'FLOW',
                            reloadData: () => this.loadNetData(),
                        });
                    }, 500);
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
                this.setState({
                    canPress: true,
                })
                // console.log('下单出错', error);
            })
    };

    /**
     * 拨打电话
     * @Author   Menger
     * @DateTime 2018-02-27
     */
    makeCall = (data) => {
        let {mobile} = this.state;
        let url = 'tel: ' + mobile;
        // console.log(mobile);
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    // console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => {
                // console.log('An error occurred', err)
            });
    };

    renderCargoInfoView = (style) => {
        let {charteredCar, mobile, cargoName, volume, unit,
        category, categoryText, cate, count, weight, otherType,
        coupon, deliveryFee, insurance} = this.state;
        if (style === 1) {
            return (
                <View>
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon}/>
                            <View style={styles.rightContent}>
                                <Text style={styles.textSymbol}>*</Text>
                                <TextInput
                                    style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder="请输入物品名称"
                                    // keyboardType = {'numeric'}
                                    defaultValue={cargoName}
                                    placeholderTextColor='#666'
                                    underlineColorAndroid={'transparent'}
                                    // onBlur = {() => this.getPrices(1, charteredCar)}
                                    onChangeText={(text) => {
                                        this.setState({
                                            cargoName: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_volume} style={styles.paymentMethodIcon}/>
                            <View style={styles.rightContent}>
                                <Text style={styles.textSymbol}>*</Text>
                                <TextInput
                                    style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder="请输入每件商品体积"
                                    keyboardType={'numeric'}
                                    defaultValue={volume}
                                    placeholderTextColor='#666'
                                    underlineColorAndroid={'transparent'}
                                    onBlur={() => style === 1 && this.getPrices(1, insurance)}
                                    onChangeText={(text) => {
                                        this.setState({
                                            volume: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{unit.volumes}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    {charteredCar == 0 && <View>
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_count} style={styles.paymentMethodIcon}/>
                                <View style={styles.rightContent}>
                                    <Text style={styles.textSymbol}>*</Text>
                                    <TextInput
                                        style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                        placeholder="请输入物品数量"
                                        keyboardType={'numeric'}
                                        defaultValue={count}
                                        placeholderTextColor='#666'
                                        underlineColorAndroid={'transparent'}
                                        onBlur={() => style === 1 && this.getPrices(1, insurance)}
                                        onChangeText={(text) => {
                                            this.setState({
                                                count: text
                                            })
                                        }}
                                    />
                                </View>
                            </View>
                            <Text style={styles.cargoAttributesUnit}>{unit.num}</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    </View>}
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_weight} style={styles.paymentMethodIcon}/>
                            <TextInput
                                style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder="请输入物品重量"
                                keyboardType={'numeric'}
                                defaultValue={weight}
                                placeholderTextColor='#666'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({
                                        weight: text
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{unit.weight}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    <View style={styles.paymentMethodTitleView}>
                        <Image source={GlobalIcons.icon_cargo_type} style={styles.paymentMethodIcon}/>
                        <Select
                            style={{flex: 1, borderWidth: 0, paddingLeft: 0,}}
                            value={categoryText}
                            valueStyle={{flex: 1, color: '#555', textAlign: 'left'}}
                            items={category}
                            getItemValue={(item, index) => item.id}
                            getItemText={(item, index) => item.name}
                            iconTintColor='#666'
                            placeholder='请选择物品类型'
                            pickerTitle='物品类型选择'
                            onSelected={(item, index) => {
                                // console.log(item);
                                this.setState({
                                    cate: item.id,
                                    categoryText: item.name
                                })
                            }}
                        />
                    </View>

                    {1 > 2 && <ModalDropdown
                        style={[styles.paymentMethodItem, styles.selectView]}
                        textStyle={styles.cargoAttributesTitle}
                        dropdownStyle={styles.dropdownStyle}
                        defaultValue={'请选择物品类型'}
                        renderRow={this.renderRow.bind(this)}
                        options={category}
                        renderButtonText={(rowData) => this.renderButtonText(rowData)}
                    >
                        <View style={styles.selectViewWrap}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_cargo_type} style={styles.paymentMethodIcon}/>
                                <Text style={styles.cargoAttributesTitle}>{categoryText}</Text>
                            </View>
                            <Image source={arrowRight} style={styles.arrowRightIcon}/>
                        </View>
                    </ModalDropdown>}
                    {cate == '1' && <View>
                        <View style={[GlobalStyles.horLine, styles.horLine]}/>
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon}/>
                                <TextInput
                                    style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder="请输入物品类型"
                                    // keyboardType = {'numeric'}
                                    defaultValue={otherType}
                                    placeholderTextColor='#666'
                                    underlineColorAndroid={'transparent'}
                                    // onBlur = {() => this.getPrices(1, charteredCar)}
                                    onChangeText={(text) => {
                                        this.setState({
                                            otherType: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>}
                </View>
            );
        } else {
            return (
                <View>
                    {this.state.charteredCar == 0 &&
                    <View>
                        <TouchableOpacity
                            style={styles.paymentMethodItem}
                            onPress={() => this.makeCall()}
                        >
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_phone} style={styles.paymentMethodIcon}/>
                                <Text style={styles.cargoAttributesTitle}>询价咨询：{this.state.mobile}</Text>
                            </View>
                            <Image source={arrowRight} style={styles.arrowRightIcon}/>
                        </TouchableOpacity>
                    </View>
                    }
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon}/>
                            <View style={styles.rightContent}>
                                <Text style={styles.textSymbol}>*</Text>
                                <TextInput
                                    style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder="请输入物品名称"
                                    // keyboardType = {'numeric'}
                                    defaultValue={this.state.cargoName}
                                    placeholderTextColor='#666'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            cargoName: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_volume} style={styles.paymentMethodIcon}/>
                            <View style={styles.rightContent}>
                                <Text style={styles.textSymbol}>*</Text>
                                <TextInput
                                    style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder="请输入货物总体积"
                                    keyboardType={'numeric'}
                                    defaultValue={this.state.volume}
                                    placeholderTextColor='#666'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            volume: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{this.state.unit.volumes}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    {this.state.charteredCar == 0 && <View>
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_count} style={styles.paymentMethodIcon}/>
                                <TextInput
                                    style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder="请输入物品数量"
                                    keyboardType={'numeric'}
                                    defaultValue={this.state.count}
                                    placeholderTextColor='#666'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            count: text
                                        })
                                    }}
                                />
                            </View>
                            <Text style={styles.cargoAttributesUnit}>{this.state.unit.num}</Text>
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    </View>}
                    <View style={styles.paymentMethodItem}>
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_weight} style={styles.paymentMethodIcon}/>
                            <TextInput
                                style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                placeholder="请输入物品重量"
                                keyboardType={'numeric'}
                                defaultValue={this.state.weight}
                                placeholderTextColor='#666'
                                underlineColorAndroid={'transparent'}
                                onChangeText={(text) => {
                                    this.setState({
                                        weight: text
                                    })
                                }}
                            />
                        </View>
                        <Text style={styles.cargoAttributesUnit}>{this.state.unit.weight}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                    <View style={styles.paymentMethodTitleView}>
                        <Image source={GlobalIcons.icon_cargo_type} style={styles.paymentMethodIcon}/>
                        <Select
                            style={{flex: 1, borderWidth: 0, paddingLeft: 0,}}
                            value={categoryText}
                            valueStyle={{flex: 1, color: '#555', textAlign: 'left'}}
                            items={category}
                            getItemValue={(item, index) => item.id}
                            getItemText={(item, index) => item.name}
                            iconTintColor='#8a6d3b'
                            placeholder='请选择物品类型'
                            pickerTitle='物品类型选择'
                            placeholderTextColor={'#666'}
                            onSelected={(item, index) => {
                                // console.log(item);
                                this.setState({
                                    cate: item.id,
                                    categoryText: item.name
                                })
                            }}
                        />
                    </View>
                    {cate == '1' && <View>
                        <View style={[GlobalStyles.horLine, styles.horLine]}/>
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_cargo} style={styles.paymentMethodIcon}/>
                                <TextInput
                                    style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                    placeholder="请输入物品类型"
                                    defaultValue={this.state.otherType}
                                    placeholderTextColor='#666'
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            otherType: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                    </View>}
                    {this.state.charteredCar == 0 && <View>
                        <View style={[GlobalStyles.horLine, styles.horLine]}/>
                        <View style={styles.paymentMethodItem}>
                            <View style={styles.paymentMethodTitleView}>
                                <Image source={GlobalIcons.icon_money} style={styles.paymentMethodIcon}/>
                                <View style={styles.rightContent}>
                                    <Text style={styles.textSymbol}>*</Text>
                                    <TextInput
                                        style={[styles.cargoAttributesTitle, styles.cargoAttributesInput]}
                                        placeholder="输入咨询后的订单价格"
                                        keyboardType={'numeric'}
                                        placeholderTextColor='#666'
                                        underlineColorAndroid={'transparent'}
                                        onBlur={() => this.getPrices(style, insurance)}
                                        onChangeText={(text) => {

                                            // this.state.insurance = this.state.insurance != null ? this.state.insurance : 0;
                                            // let value1 = 0;
                                            // let value2 = 0;
                                            // if (deliveryFee && deliveryFee[0] && deliveryFee[0].is_selected === 1) {
                                            //     value1 = deliveryFee[0].value;
                                            // }
                                            // if (deliveryFee && deliveryFee[1] && deliveryFee[1].is_selected === 1) {
                                            //     value2 = deliveryFee[1].value;
                                            // }
                                            // deliveryFeeValue = (parseFloat(value1).toFixed(2) * 100 + parseFloat(value2).toFixed(2) * 100) / 100;
                                            // let relprice = (parseFloat(text).toFixed(2) * 100 - parseInt(this.state.coupon) * 100 + parseFloat(deliveryFeeValue).toFixed(2) * 100) / 100;
                                            // console.log(relprice);
                                            this.setState({
                                                price: text,
                                                // relprice: relprice,
                                            })
                                        }}
                                    />
                                </View>
                            </View>
                            <Text style={styles.cargoAttributesUnit}>元</Text>
                        </View>
                    </View>}
                </View>
            );
        }
    };
    renderDeliveryFee = (data) => {
        let {relprice} = this.state;
        if (!data || data.length < 1) {
            data = [
                {name: '取件费', value: '0', is_selected: 0},
                {name: '送件费', value: '0', is_selected: 0},
            ];
            return;
        }
        let delivery = data.map((obj, index) => {
            if (obj.value === '') {
                return;
            }
            return (
                <TouchableOpacity
                    key={obj.name}
                    style={styles.deliverFeeView}
                    onPress={() => {
                        data[index].is_selected = obj.is_selected === 1 ? 0 : 1;
                        let price = 0;
                        if (obj.is_selected === 1) {
                            price = (parseFloat(relprice).toFixed(2) * 100 + parseFloat(obj.value).toFixed(2) * 100) / 100;
                        } else {
                            price = (parseFloat(relprice).toFixed(2) * 100 - parseFloat(obj.value).toFixed(2) * 100) / 100;
                        }
                        this.setState({
                            deliveryFee: data,
                            relprice: price,
                        });
                        // console.log('取件', relprice);
                    }}
                >
                    <Text style={styles.deliverFeeTitle}>{obj.name}{obj.value}元</Text>
                    <Image source={obj.is_selected === 1 ? GlobalIcons.icon_checked : GlobalIcons.icon_check}
                           style={GlobalStyles.checkedIcon}/>
                </TouchableOpacity>
            );
        });

        return (
            <View style={[styles.containerItemView, styles.deliveryCarView]}>
                <View style={styles.containerItemTitleView}>
                    <Text
                        style={[styles.containerItemTitleLeft, styles.containerItemTitle]}>小件取送费</Text>
                </View>
                <View style={[GlobalStyles.horLine, styles.horLine]}/>
                {delivery}
            </View>
        );
    };

    render() {
        let {
            uploading, img1, img2, img3, shipperAdd, receiverAdd,
            category, categoryText, cate, canPress, charteredCar, style, deliveryFee,
            insurance, money_arr, premiums_link
        } = this.state;
        insurance = insurance ? `${insurance}元` : insurance;
        // console.log(insurance);
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'我要发货'}
                    leftButton={UtilsView.getLeftButton(() => {
                        this.state.canBack && this.onBack()
                    })}
                />
                <ScrollView style={GlobalStyles.hasFixedContainer}>
                    <KeyboardAwareScrollView>
                        <CustomKeyboard.AwareCusKeyBoardScrollView>
                            <View style={[styles.containerItemView, styles.addressInfoView]}>
                                <View style={styles.addressLeftView}>
                                    <View
                                        style={[GlobalStyles.placeViewIcon, GlobalStyles.placeStartIcon, styles.placeViewIcon]}>
                                        <Text style={GlobalStyles.placeText}>发</Text>
                                    </View>
                                    <View style={[GlobalStyles.verLine, styles.verLine]}/>
                                    <View
                                        style={[GlobalStyles.placeViewIcon, GlobalStyles.placeEndIcon, styles.placeViewIcon]}>
                                        <Text style={GlobalStyles.placeText}>收</Text>
                                    </View>
                                </View>
                                <View style={styles.addressRightView}>
                                    <View style={styles.addressDetailView}>
                                        <View style={styles.addressDetailLeft}>
                                            <Text
                                                style={styles.addressUserInfo}>{shipperAdd ? `${shipperAdd.name} ${shipperAdd.phone}` : '发货人'}</Text>
                                            <Text
                                                style={styles.addressDetailCon}>{shipperAdd ? shipperAdd.address_detail : '请选择发货地址'}</Text>
                                        </View>
                                        <View style={[GlobalStyles.verLine, styles.verLine]}/>
                                        <TouchableOpacity
                                            style={styles.addressDetailRight}
                                            onPress={() => this.selectContent('MineAddressShipperList')}
                                        >
                                            <Text style={styles.addressDetailRightCon}>地址簿</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[GlobalStyles.horLine, styles.horLine]}/>
                                    <View style={styles.addressDetailView}>
                                        <View style={styles.addressDetailLeft}>
                                            <Text
                                                style={styles.addressUserInfo}>{receiverAdd ? `${receiverAdd.name} ${receiverAdd.phone}` : '收货人'}</Text>
                                            <Text
                                                style={styles.addressDetailCon}>{receiverAdd ? receiverAdd.address_detail : '请选择收货地址'}</Text>
                                        </View>
                                        <View style={[GlobalStyles.verLine, styles.verLine]}/>
                                        <TouchableOpacity
                                            style={styles.addressDetailRight}
                                            onPress={() => this.selectContent('MineAddressList')}
                                        >
                                            <Text style={styles.addressDetailRightCon}>地址簿</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.containerItemView, styles.cargoInfoView]}>
                                <View style={styles.containerItemTitleView}>
                                    <Text
                                        style={[styles.containerItemTitleLeft, styles.containerItemTitle]}>添加物品信息</Text>
                                    <View style={styles.containerItemTitleRight}>
                                        <TouchableOpacity
                                            style={[styles.cargoTypeItem, style == '1' && styles.cargoTypeItemCur]}
                                            onPress={() => this.changeOrderStyle(1, 0)}
                                        >
                                            <Text
                                                style={[styles.cargoTypeItemCon, style == '1' && styles.cargoTypeItemConCur]}>单个计算</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.cargoTypeItem, style == '2' && styles.cargoTypeItemCur]}
                                            onPress={() => this.changeOrderStyle(2, 0)}
                                        >
                                            <Text
                                                style={[styles.cargoTypeItemCon, style == '2' && styles.cargoTypeItemConCur]}>整体计算</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.cargoTypeItem, style == '3' && styles.cargoTypeItemCur]}
                                            onPress={() => this.changeOrderStyle(3, 0)}
                                        >
                                            <Text
                                                style={[styles.cargoTypeItemCon, style == '3' && styles.cargoTypeItemConCur]}>整车</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.cargoTypeItem, style == '4' && styles.cargoTypeItemCur]}
                                            onPress={() => this.changeOrderStyle(4, 0)}
                                        >
                                            <Text
                                                style={[styles.cargoTypeItemCon, style == '4' && styles.cargoTypeItemConCur]}>国际物流</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[GlobalStyles.horLine, styles.horLine]}/>
                                {this.renderCargoInfoView(parseInt(style, 10))}
                            </View>

                            <View style={[styles.containerItemView, styles.cargoAlbumView]}>
                                <View style={styles.containerItemTitleView}>
                                    <Text
                                        style={[styles.containerItemTitleLeft, styles.containerItemTitle]}>添加物品照片</Text>
                                </View>
                                <View style={[GlobalStyles.horLine, styles.horLine]}/>
                                <View style={[styles.containerItemConView, styles.cargoPictureView]}>
                                    {uploading && img1 === '' ?
                                        <Spinner style={styles.spinner} isVisible={uploading} size={50}
                                                 type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                                        :
                                        img1 != '' && <TouchableOpacity
                                            style={styles.uploadPicView}
                                            onPress={() => {
                                                this.setState({
                                                    img1: '',
                                                })
                                            }}
                                        >
                                            <View style={styles.deleteIcon}>
                                                <Image source={GlobalIcons.icon_delete} style={styles.deleteIconCon}/>
                                            </View>
                                            <Image source={{uri: img1}}
                                                   style={[GlobalStyles.uploadIcon, styles.uploadImages]}/>
                                        </TouchableOpacity>
                                    }
                                    {uploading && img1 != '' && img2 === '' ?
                                        <Spinner style={styles.spinner} isVisible={uploading} size={50}
                                                 type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                                        :
                                        img2 != '' && <TouchableOpacity
                                            style={styles.uploadPicView}
                                            onPress={() => {
                                                this.setState({
                                                    img2: '',
                                                })
                                            }}
                                        >
                                            <View style={styles.deleteIcon}>
                                                <Image source={GlobalIcons.icon_delete} style={styles.deleteIconCon}/>
                                            </View>
                                            <Image source={{uri: img2}}
                                                   style={[GlobalStyles.uploadIcon, styles.uploadImages]}/>
                                        </TouchableOpacity>
                                    }
                                    {uploading && img1 != '' && img2 != '' && img3 === '' ?
                                        <Spinner style={styles.spinner} isVisible={uploading} size={50}
                                                 type={'ChasingDots'} color={GlobalStyles.themeLightColor}/>
                                        :
                                        img3 != '' && <TouchableOpacity
                                            style={styles.uploadPicView}
                                            onPress={() => {
                                                this.setState({
                                                    img3: '',
                                                })
                                            }}
                                        >
                                            <View style={styles.deleteIcon}>
                                                <Image source={GlobalIcons.icon_delete} style={styles.deleteIconCon}/>
                                            </View>
                                            <Image source={{uri: img3}}
                                                   style={[GlobalStyles.uploadIcon, styles.uploadImages]}/>
                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity
                                        style={GlobalStyles.uploadView}
                                        onPress={() => this.handleOpenImagePicker()}
                                    >
                                        <Image source={GlobalIcons.images_bg_upload} style={GlobalStyles.uploadIcon}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {this.renderDeliveryFee(deliveryFee)}

                            <View style={[styles.containerItemView, styles.deliveryCarView, {marginTop: -15}]}>
                                <View style={[GlobalStyles.horLine, styles.horLine]}/>
                                <View style={styles.containerItemConView}>
                                    <TextInput
                                        style={styles.inputItemCon}
                                        multiline={true}
                                        placeholder="其他注意事项..."
                                        placeholderTextColor='#888'
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={(text) => {
                                            this.setState({
                                                remark: text
                                            })
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={[styles.containerItemView, styles.deliveryCouponView]}>
                                <TouchableOpacity
                                    style={styles.containerItemTitleView}
                                    onPress={() => this.selectContent('MineCoupon')}
                                >
                                    <View style={styles.containerItemTitleLeft}>
                                        <Text style={styles.containerItemTitle}>选择优惠券</Text>
                                    </View>
                                    <View style={styles.containerItemTitleRight}>
                                        {this.state.coupon != '0' && <Text
                                            style={[styles.containerItemTitleConText, styles.deliveryCouponConText]}>¥ {parseFloat(this.state.coupon).toFixed(2)}</Text>}
                                        <Image source={arrowRight} style={styles.arrowRightIcon}/>
                                    </View>
                                </TouchableOpacity>
                                <View style={[GlobalStyles.horLine, styles.horLine]}/>
                                <View
                                    style={styles.containerItemTitleView}
                                >
                                    <View style={[styles.containerItemTitleLeft,]}>
                                        <View style={[styles.containerItemTitleLeft, {flexDirection: 'row'}]}>
                                            <Text style={styles.containerItemTitle}>货物保险</Text>
                                            <TouchableOpacity
                                                onPress={() => this.onPushToNextPage('保险须知', 'CooperateDetail', {webUrl: premiums_link})}
                                            >
                                                <Text
                                                    style={[styles.containerItemTitle, {color: GlobalStyles.themeColor}]}>《保险须知》</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{
                                            fontSize: 11,
                                            color: '#555',
                                            marginTop: 5,
                                            marginLeft: 64
                                        }}>注：选择保险，将无法选择到付</Text>
                                    </View>
                                    <Select
                                        style={{flex: 1, borderWidth: 0,}}
                                        value={insurance}
                                        valueStyle={{flex: 1, color: '#555', textAlign: 'right'}}
                                        items={money_arr}
                                        getItemValue={(item, index) => item.value}
                                        getItemText={(item, index) => item.name}
                                        pickerTitle='货物保险费'
                                        placeholder='请选择'
                                        placeholderTextColor='#666'
                                        onSelected={(item, index) => {
                                            if (item.name === '取消') {
                                                this.setState({
                                                    insurance: null
                                                });
                                                this.getPrices(style, 0);
                                            } else {
                                                this.setState({
                                                    insurance: item.value
                                                });
                                                this.getPrices(style, item.value);
                                            }
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={[styles.containerItemView, styles.deliveryTotalMoneyView]}>
                                <View style={styles.containerItemTitleView}>
                                    <View style={styles.containerItemTitleLeft}>
                                        <Text style={styles.containerItemTitle}>总计费用</Text>
                                    </View>
                                    <View style={styles.containerItemTitleRight}>
                                        <Text
                                            style={[styles.containerItemTitleConText, styles.deliveryTotalMoneyText]}>¥ {parseFloat(this.state.relprice).toFixed(2)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.containerItemView, styles.flowProtocolView]}>
                                <TouchableOpacity
                                    style={styles.flowProtocolBtnView}
                                    onPress={() => {
                                        let state = this.state.agree == '1' ? 0 : 1;
                                        this.setState({
                                            agree: state,
                                        })
                                    }}
                                >
                                    <Image source={this.state.agree == '1' ? selectedIcon : selectIcon}
                                           style={GlobalStyles.checkedIcon}/>
                                    <Text style={styles.flowProtocolBtnCon}>我已阅读并同意</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.flowProtocolBtnView}
                                    onPress={() => this.onPushToNextPage('服务协议', 'FlowProtocol')}
                                >
                                    <Text style={styles.flowProtocolName}>《服务协议》</Text>
                                </TouchableOpacity>
                            </View>
                        </CustomKeyboard.AwareCusKeyBoardScrollView>
                    </KeyboardAwareScrollView>
                </ScrollView>
                <View style={GlobalStyles.fixedBtnView}>
                    <TouchableOpacity
                        style={[GlobalStyles.btnView, styles.btnView]}
                        onPress={() => {
                            canPress && this.doSubmitOrder()
                        }}
                    >
                        <Text style={[GlobalStyles.btnItem, styles.btnItem]}>订单确认</Text>
                    </TouchableOpacity>
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
    scrollContainer: {
        marginBottom: 90,
    },
    uploadImages: {
        marginRight: 10,
    },
    containerItemView: {
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    addressInfoView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressLeftView: {
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeViewIcon: {
        marginRight: 0,
        marginVertical: 10,
    },
    verLine: {
        height: 40,
    },
    horLine: {
        marginVertical: 5,
    },
    addressRightView: {
        flex: 1,
    },
    addressDetailView: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#f60',
        justifyContent: 'space-between',
    },
    addressDetailLeft: {
        flex: 1,
        height: 45,
        justifyContent: 'space-around',
    },
    addressUserInfo: {
        fontSize: 16,
        color: '#333',
    },
    addressDetailCon: {
        fontSize: 14,
        color: '#666',
    },
    addressDetailRight: {
        width: 70,
        alignItems: 'center',
    },
    addressDetailRightCon: {
        fontSize: 16,
        color: GlobalStyles.themeColor,
    },
    arrowRightIcon: {
        width: 18,
        height: 18,
        marginLeft: 5,
        tintColor: '#666',
        resizeMode: 'contain',
    },
    cargoInfoView: {},
    containerItemTitleView: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#123',
        justifyContent: 'space-between',
    },
    containerItemTitleLeft: {},
    containerItemTitle: {
        color: '#333',
    },
    containerItemTitleRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cargoTypeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    cargoTypeItemCur: {
        // paddingBottom: 2,
        borderBottomWidth: 1,
        borderColor: GlobalStyles.themeColor,
    },
    cargoTypeItemCon: {
        fontSize: 13,
        color: '#999',
        // marginLeft: 5,
    },
    cargoTypeItemConCur: {
        color: GlobalStyles.themeColor,
    },
    cargoPictureView: {
        flexDirection: 'row',
    },
    paymentMethodItem: {
        // marginTop: 5,
        height: 45,
        // backgroundColor: '#123',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paymentMethodTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        // width: GlobalStyles.width - 100,
    },
    paymentMethodIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
        resizeMode: 'contain',
    },
    paymentMethodTitle: {
        color: '#333',
    },
    cargoAttributesTitle: {
        fontSize: 14,
        color: '#666',
    },
    cargoAttributesInput: {
        height: 40,
        marginRight: 5,
        width: GlobalStyles.width - 120,
    },
    cargoAttributesUnit: {
        color: '#444',
    },
    deliveryCarConView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    deliveryCarItem: {
        marginVertical: 5,
        alignItems: 'center',
        width: (GlobalStyles.width - 30) / 4,
    },
    deliveryCarIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    deliveryCarName: {
        color: '#666',
    },
    deliveryTypeView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deliveryTypeItem: {
        height: 60,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: GlobalStyles.themeColor,
        width: (GlobalStyles.width - 60) / 2,
    },
    deliveryTypeName: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    deliveryTypeVerLine: {
        height: 60,
        backgroundColor: GlobalStyles.themeColor,
    },
    deliveryTypeIconView: {
        width: 70,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deliveryTypeIconViewCur: {
        backgroundColor: GlobalStyles.themeColor,
    },
    deliveryTypeIcon: {
        width: 40,
        resizeMode: 'contain',
    },
    deliveryTypeIconCur: {
        tintColor: '#fff',
    },
    inputItemCon: {
        height: 100,
        textAlignVertical: 'top',
        // backgroundColor: '#123',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    deliveryCouponView: {},
    deliveryCouponTitle: {},
    deliveryCouponConView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryCouponConText: {
        fontSize: 15,
    },
    deliveryTotalMoneyText: {
        fontSize: 18,
        color: '#f60',
    },
    flowProtocolView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    flowProtocolBtnView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flowProtocolBtnCon: {
        marginLeft: 10,
    },
    flowProtocolName: {
        color: GlobalStyles.themeColor
    },
    uploadPicView: {
        position: 'relative',
    },
    deleteIcon: {
        position: 'absolute',
        top: isIos ? -5 : 0,
        right: 5,
        width: 16,
        height: 16,
        backgroundColor: '#f00',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    deleteIconCon: {
        width: 18,
        height: 18,
    },
    selectView: {},
    selectViewWrap: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: GlobalStyles.width - 30,
    },
    dropdownStyle: {
        height: 200,
        marginLeft: 40,
        width: GlobalStyles.width - 90,
    },
    dropdownRow: {
        height: 40,
        justifyContent: 'center',
    },
    dropdownRowText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    deliverFeeView: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deliverFeeTitle: {
        fontSize: 15,
        color: '#555',
    },
    deliverFeeCon: {
        fontSize: 14,
        color: GlobalStyles.themeColor,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    textSymbol: {
        fontSize: 18,
        color: '#f00',
        marginRight: 5,
    },
});
