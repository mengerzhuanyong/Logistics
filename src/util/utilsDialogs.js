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
    TextInput,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';

const {width, height, scale} = Dimensions.get('window');

// 类
export default class PopModel extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        show: false,
        title: '系统提示',
        contentText: '这是一个系统信息',
        cancelBtnName: '取消',
        confirmBtnName: '确定',
        cancelFoo: () => {},
        confirmFoo: () => {},
    };

    render() {
        const {show, title, contentText, cancelBtnName, confirmBtnName, cancelFoo, confirmFoo} = this.props;
        return (
            <View style={styles.container}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <TouchableHighlight style={styles.modalStyle} onPress={cancelFoo}>
                        <View style={styles.subView}>
                            <Text style={styles.titleText}>{title}</Text>
                            <Text style={styles.contentText}>{contentText}</Text>
                            <View style={styles.horizontalLine}/>
                            <View style={styles.buttonView}>
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    style={styles.buttonStyle}
                                    onPress={cancelFoo}>
                                    <Text style={styles.buttonText}>取消</Text>
                                </TouchableHighlight>
                                <View style={styles.verticalLine}/>
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    style={styles.buttonStyle}
                                    onPress={confirmFoo}>
                                    <Text style={styles.buttonText}>确定</Text>
                                </TouchableHighlight>
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
        flex: 1,
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
    // modal上子View的样式
    subView: {
        marginLeft: 60,
        marginRight: 60,
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
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
        margin: 8,
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
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