/**
 * 速芽物流用户端 - ShopRankView
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import { toastShort, consoleLog } from '../../util/utilsToast'

export default class ShopRankView extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            page_flag: this.props.page_flag
        }
    }

    static defaultProps = {
        star: {
            tens_digit: 0,
            digit: 0,
        },
        page_flag: 'list',
        // tagsPosition: false,
    }

    updateState = (state) => {
        if (!this) {
            return
        }
        this.setState(state);
    };

    renderShopTags = (data) => {
        if(data.length <= 0) {
            return;
        }
        let tags = data.map((obj,index)=>{
            if (obj.name == 2) {
                return (
                    <TouchableOpacity
                        key = {"tags"+index}
                        style = {styles.tagsButton}
                        onPress = {() => {
                            // toastShort('💎: 缴纳1000元押金💎💎: 缴纳1000元押金💎💎💎: 缴纳1000元押金💎💎💎💎: 缴纳1000元押金', 'center', styles.toastText, styles.toastContainer);
                            toastShort(obj.tips, 'center', styles.toastText, styles.toastContainer);
                        }}
                    >
                        <Image source={GlobalIcons.icon_diamond} style={[styles.shopTagsIcon, styles.diamondIcon]} />
                    </TouchableOpacity>
                )
            } else if (obj.name == '优') {
                return (
                    <TouchableOpacity
                        key = {"tags"+index}
                        style = {styles.tagsButton}
                        onPress = {() => {
                            toastShort(obj.tips, 'center', styles.toastText, styles.toastContainer);
                        }}
                    >
                        <Image source={GlobalIcons.icon_excellent} style={[styles.shopTagsIcon, GlobalStyles.ml_10]} />
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity
                        key = {"tags"+index}
                        style = {styles.tagsButton}
                        onPress = {() => {
                            toastShort(obj.tips, 'center', styles.toastText, styles.toastContainer);
                        }}
                    >
                        <Text style={styles.tagsName}>冷藏</Text><Text style={styles.shopTagSnow}>❄️</Text>
                    </TouchableOpacity>
                )
            }
        });
        return tags;
    }

    render(){
        const { tags } = this.props;
        const {page_flag} = this.state;
        return (
            <View style={[styles.container, page_flag == 'detail' && {justifyContent: 'flex-end'}]} onLayout={this.props.onLayout}>
                {this.renderShopTags(tags)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: GlobalStyles.width > 359 ? 'flex-end' : 'flex-start',
    },
    toastText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    toastContainer: {
        width: 100,
        backgroundColor: 'rgba(99, 99, 99, 0.6)',
    },
    tagsButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopTagsIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
    },
    shopTagSnow: {
        fontSize: 14,
        marginLeft: 5,
    },
    shopTagsNameView: {
        width: 20,
        height: 20,
        marginLeft: 5,
        borderWidth: 1,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: GlobalStyles.themeColor,
    },
    shopTagsName: {
        fontSize: 12,
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
        color: GlobalStyles.themeColor,
    },
    tagsName: {
        fontSize: 13,
        color: GlobalStyles.themeColor,
    },
    diamondIcon: {
        width: 18,
        height: 18,
        marginLeft: 6,
    }
});