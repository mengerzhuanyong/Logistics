/**
 * 速芽物流 - PopModel
 * http://menger.me
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
                                <View style={[styles.contentItemView, styles.rss]}>
                                    <View style={styles.textIconView}>
                                        {/*<Text style={[styles.contentText, styles.contentTextCur]}>安全值</Text>*/}
                                        <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                                    </View>
                                    <View style={[styles.contentItemConView]}>
                                        <Text style={[styles.contentText]}>商家缴纳保证金的多少分为四个等级，最高四颗钻石。如货物有损伤，平台可用商家的保证金对用户进行强制性赔偿，等级越高赔偿金额越高。</Text>
                                    </View>
                                </View>
                                <View style={[styles.contentItemView, styles.rss]}>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_excellent} style={[styles.shopTagsIcon, {width: 16, height: 16,}]} />
                                </View>
                                    <View style={[styles.contentItemConView]}>
                                    <Text style={[styles.contentText]}>商家有平台提供的小件专用纸箱，对小件货物有极好的安全保障</Text>
                                </View>
                                </View>
                                {/*<View style={[styles.contentItemView, styles.rss]}>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_special} style={[styles.shopTagsIcon]} />
                                </View>
                                    <View style={[styles.contentItemConView]}>
                                    <Text style={[styles.contentText]}>商家有直达的线路，中途不需要转车</Text>
                                </View>
                                </View>*/}
                                <View style={[styles.contentItemView, styles.rss]}>
                                <View style={styles.textIconView}>
                                    <Image source={GlobalIcons.icon_card} style={[styles.shopTagsIcon]} />
                                </View>
                                    <View style={[styles.contentItemConView]}>
                                    <Text style={[styles.contentText]}>平台工作人员对商家信息的真实性进行了认证</Text>
                                </View>
                                </View>
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
    rcc: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rss: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    contentItemView: {
        width: GlobalStyles.width - 100,
    },
    contentItemConView: {
        flex: 1,
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
    contentTextCur: {
        fontSize: 13,
        color: GlobalStyles.themeColor,
    },
    contentText: {
        fontSize: 11,
        color: '#555',
        lineHeight: 20,
        // textAlign: 'center',
    },
    textIconView: {
        minWidth: 40,
        marginRight: 10,
        marginVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: GlobalStyles.themeColor,
    },
    textIconViewZ:{
        borderRadius:3,
        marginVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#815cfe'
    },
    textIcon: {
        fontSize: 14,
        color: '#fff',
        marginVertical: 3,
    },
    shopTagsIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    diamondIcon: {
        width: 18,
        height: 18,
    },

    // modal上子View的样式
    subView: {
        marginHorizontal: GlobalStyles.width * .11,
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
    imageText:{
        marginHorizontal:5,
        fontSize:13,
        color:'#fff'
    },
});