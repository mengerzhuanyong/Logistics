/**
 * 速芽物流用户端 - ViewUtils
 * https://menger.me
 * @大梦
 */

'use strict'

import React  from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import GlobalIcons from '../constant/GlobalIcon'

export default class ViewUtils {
    

    /**
     * 获取设置页的Item
     * @Author   Menger
     * @DateTime 2018-01-17
     * @param callBack 单击item的回调
     * @param icon 左侧图标
     * @param text 显示的文本
     * @param tintStyle 图标着色
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
        return (
            <TouchableHighlight
                onPress = {callBack}
            >
                <View style={[styles.setting_item_container]}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        {icon ?
                            <Image source={icon} style={[{opacity: 1, width: 16, height: 16, marginRight: 10,resizeMode:'stretch'}, tintStyle]} />
                            :
                            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>
                        }
                        <Text>{text}</Text>
                    </View>
                    <Image
                        source = {expandableIco ? expandableIco : GlobalIcons.icon_angle_left_white}
                        style = {[styles.settingBtnIcon, tintStyle]}
                    />
                </View>
            </TouchableHighlight>
        )
    }
    
    /**
     * 左侧导航按钮
     * @Author   Menger
     * @DateTime 2018-01-17
     * @param    callBack
     * @return   {XML}
     */
    static getLeftButton = (callBack) => {
        return (
            <TouchableOpacity
                style = {{padding: 8}}
                onPress = {callBack}
            >
                <Image style={{width: 26, height: 26,}} source={GlobalIcons.icon_angle_left_white}/>
            </TouchableOpacity>
        )
    }
    
    /**
     * 右侧侧导航按钮
     * @Author   Menger
     * @DateTime 2018-01-17
     * @param    callBack
     * @return   {XML}
     */
    static getRightButton = (title, callBack) => {
        return (
            <TouchableOpacity
                style = {{alignItems: 'center',}}
                onPress = {callBack}
            >
                <View style={{marginRight: 10}}>
                    <Text style={{fontSize: 20, color: '#fff',}}>{title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * 获取更多按钮
     * @Author   Menger
     * @DateTime 2018-01-17
     * @param callBack
     * @returns {XML}
     */
    static getMoreButton = (callBack) => {
        return (
            <TouchableHighlight
                ref = "moreMenuButton"
                style = {{padding: 5}}
                onPress = {callBack}
                underlayColor = {'transparent'}
            >
                <View style={{paddingRight: 8}}>
                <Image style={styles.moreMenuBtnIcon} source={GlobalIcons.icon_angle_left_white} />
                </View>
            </TouchableHighlight>
        )
    }

    /**
     * 获取分享按钮
     * @Author   Menger
     * @DateTime 2018-01-17
     * @param callBack
     * @returns {XML}
     */
    static getShareButton = (callBack) => {
        return (
            <TouchableHighlight
                onPress = {callBack}
                underlayColor = {'transparent'}
            >
                <Image style={styles.shareBtnIcon} source={GlobalIcons.icon_angle_left_white}/>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        height: 60,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    settingBtnIcon: {
        marginRight: 10,
        height: 22,
        width: 22,
        alignSelf: 'center',
        opacity: 1
    },
    moreMenuBtnIcon: {
        width: 24,
        height: 24,
    },
    shareBtnIcon: {
        width: 20,
        height: 20,
        opacity: 0.9,
        marginRight: 10,
        tintColor: 'white'
    },
})