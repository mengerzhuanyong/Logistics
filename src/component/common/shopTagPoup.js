/**
 * 速芽物流 - PopModel
 * https://menger.me
 * @大梦
 */

'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Modal,
    Linking,
    TextInput,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import { toastShort, consoleLog } from '../../util/utilsToast'

const {width, height, scale} = Dimensions.get('window');

export default class PopModel extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            show: props.show,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        show: false,
        title: '系统提示',
        contentText: '这是一个系统信息',
        contentView: null,
        cancelBtnName: '取消',
        confirmBtnName: '电话咨询',
        cancelFoo: () => {},
        confirmFoo: () => {},
        style: {},
        titleStyle: {},
        contentStyle: {},
    };

    componentDidMount(){
        let url = NetApi.phone;
        this.netRequest.fetchGet(url)
            .then(result => {
                if (result && result.code === 1) {
                    this.setState({
                        phone: result.data
                    })
                }
            })
    }

    modalVisible = () => {
        this.setState({
            show: !this.state.show,
        })
    }

    makeCall = () => {
        let { phone } = this.state;
        let url = 'tel: ' + phone;
        this.modalVisible();
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err)=>{})
    }

    render() {
        let {title, contentText, contentView, cancelBtnName, confirmBtnName, cancelFoo, confirmFoo, style, titleStyle, contentStyle} = this.props;
        let {show} = this.state;
        return (
            <View style={styles.container}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <TouchableHighlight style={styles.modalStyle} onPress={() => this.modalVisible()}>
                        <View style={[styles.subView, style]}>
                            <View style={[styles.contentView]}>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                </View>
                                <Text style={[styles.contentText]}>平台有条件让商家对普通小额损毁货物进行赔偿</Text>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                </View>
                                <Text style={[styles.contentText]}>平台有条件让商家对多数损毁货物进行赔偿</Text>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                </View>
                                <Text style={[styles.contentText]}>平台有条件让商家对大多数损毁货物进行赔偿</Text>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                    <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                </View>
                                <Text style={[styles.contentText]}>平台有条件让商家对绝大多数及特殊、价值高的损毁货物进行赔偿</Text>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_excellent} style={[styles.shopTagsIcon]} />
                                </View>
                                <Text style={[styles.contentText]}>有物流专业打印机，有专业防爆防水中转箱，对小件有极高安全系数的优质商家</Text>
                            </View>
                            <View style={styles.horizontalLine}/>
                            <View style={styles.buttonView}>
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    style={styles.buttonStyle}
                                    onPress={() => this.modalVisible()}>
                                    <Text style={styles.buttonText}>{cancelBtnName}</Text>
                                </TouchableHighlight>
                                {1 > 2 && 
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    style={styles.buttonStyle}
                                    onPress={() => this.makeCall()}>
                                    <View style={styles.verticalLine}/>
                                    <Text style={styles.buttonText}>{confirmBtnName}</Text>
                                </TouchableHighlight>}
                            </View>
                        </View>
                    </TouchableHighlight>
                </Modal>
            </View>
        );
    }
}
// Modal属性
// 1.animationType bool  控制是否带有动画效果
// 2.onRequestClose  Platform.OS==='android'? PropTypes.func.isRequired : PropTypes.func
// 3.onShow function方法
// 4.transparent bool  控制是否带有透明效果
// 5.visible  bool 控制是否显示

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ececf0',
    },
    // modal的样式
    modalStyle: {
        backgroundColor: 'rgba(0,0,0,.5)',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    contentView: {
        padding: 20,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    // 标题
    titleText: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // 内容
    contentText: {
        fontSize: 11,
        color: '#555',
        lineHeight: 20,
        textAlign: 'center',
    },
    textIconView: {
        marginVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: GlobalStyles.themeColor,
    },
    textIcon: {
        fontSize: 14,
        color: '#fff',
        marginVertical: 3,
    },
    shopTagsIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    diamondIcon: {
        width: 18,
        height: 18,
        marginLeft: 6,
    },

    // modal上子View的样式
    subView: {
        marginHorizontal: 60,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
    // 水平的分割线
    horizontalLine: {
        marginTop: 5,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 竖直的分割线
    verticalLine: {
        width: 0.5,
        height: 40,
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393f2',
        textAlign: 'center',
    },
});