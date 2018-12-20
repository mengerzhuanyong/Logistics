/**
 * 速芽物流商家端 - NavigationBar
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react';
import {Dimensions, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native'
import PropTypes from 'prop-types'
import {Theme} from 'teaset'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

const __IOS__ = Platform.OS === 'ios';
const __ANDROID__ = Platform.OS === 'android';
const screenWidth = Dimensions.get('window').width;
const NAV_BAR_HEIGHT_IOS = GlobalStyles.statusBar_Height_Ios;
const NAV_BAR_HEIGHT_ANDROID = GlobalStyles.statusBar_Height_Android;
const STATUS_BAR_HEIGHT = 20;
const ButtonShape = {
    title: PropTypes.string.isRequired,
    style: PropTypes.any,
    handler: PropTypes.func,
};
const StatusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'dark-content', 'default',]),
    networkActivityIndicatorVisible: PropTypes.bool,
    showHideTransition: PropTypes.oneOf(['fade', 'slide']),
    hidden: PropTypes.bool,
    translucent: PropTypes.bool,
    backgroundColor: PropTypes.string,
    animated: PropTypes.bool
};

export default class NavigationBar extends Component {

    static propTypes = {
        style: PropTypes.object,
        titleLayoutStyle: PropTypes.object,
        navigator: PropTypes.object,
        leftButtonTitle: PropTypes.string,
        popEnabled: PropTypes.bool,
        onLeftButtonClick: PropTypes.func,
        title: PropTypes.string,
        titleView: PropTypes.element,
        rightButtonView: PropTypes.element,
        hide: PropTypes.bool,
        backgroundImage: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.oneOfType([
            PropTypes.shape(ButtonShape),
            PropTypes.element,
        ]),
        rightButton2: PropTypes.oneOfType([
            PropTypes.shape(ButtonShape),
            PropTypes.element,
        ]),
        leftButton: PropTypes.oneOfType([
            PropTypes.shape(ButtonShape),
            PropTypes.element,
        ]),
    }

    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false,
            translucent: false,
            animated: false,
        },
        backgroundImage: true,
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            popEnabled: true,
            hide: false,
        };
    }

    leftView() {
        var leftView = this.props.leftButtonTitle ?
            <Text style={styles.title}>{this.props.leftButtonTitle}</Text> : null;
        return (
            <TouchableOpacity
                onPress={() => this.onLeftButtonClick()}>
                <View style={{width: 50, alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                    {this.props.leftView ? this.props.leftView : leftView}
                </View>
            </TouchableOpacity>
        )
    }

    onLeftButtonClick() {
        if (this.props.navigator && this.props.popEnabled) this.props.navigator.pop();
        if (this.props.onLeftButtonClick) this.props.onLeftButtonClick();
    }

    getButtonElement(data = {}, style) {
        return (
            <View style={styles.navBarButton}>
                {(!!data.props) ? data : (
                    <NavBarButton
                        title={data.title}
                        style={[data.style, style,]}
                        tintColor={data.tintColor}
                        disabled={data.disabled}
                        handler={data.handler}/>
                )}
            </View>
        );
    }


    render() {
        let backGroundImage = this.props.backgroundImage &&
            <Image source={GlobalIcons.images_bg_navigation} style={styles.backgroundImage}/>;
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar}
                           barStyle={this.props.statusBar.barStyle ? this.props.statusBar.barStyle : "light-content"}
                           backgroundColor="transparent" translucent={true} style={styles.statusBar}/>
            </View> : null;
        let titleView = this.props.titleView ? this.props.titleView :
            <Text style={[styles.title, {color: "#fff"}, this.props.titleStyle]} ellipsizeMode="tail"
                  numberOfLines={1}>{this.props.title}</Text>;
        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {/*{this.leftView()}*/}
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {/*{this.rightView()}*/}
                <View style={styles.navButton}>
                    {this.getButtonElement(this.props.rightButton, {})}
                    {this.getButtonElement(this.props.rightButton2, {})}
                </View>
            </View>;
        return (
            <View style={[styles.container, this.props.style,]}>
                {backGroundImage}
                {statusBar}
                {content}
            </View>
        )
    }
}

class NavBarButton extends Component {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]),
        tintColor: PropTypes.string,
        title: PropTypes.string,
        handler: PropTypes.func,
    };

    static defaultProps = {
        style: {},
        title: '',
        tintColor: '#0076ff',
        onPress: () => ({}),
    };

    render() {
        const {style, tintColor, margin, title, handler, disabled} = this.props;
        return (
            <TouchableOpacity style={styles.navBarButton} onPress={handler}
                              disabled={(disabled == undefined || disabled == null) ? false : (disabled == false ? false : true)}>
                <View style={style}>
                    <Text style={[styles.title, {color: tintColor, marginLeft: 10, fontSize: 16},]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: (Theme.isIPhoneX || __ANDROID__) ? 20 : 0,
        backgroundColor: GlobalStyles.themeColor,
    },
    backgroundImage: {
        top: 0,
        bottom: 0,
        resizeMode: 'cover',
        position: 'absolute',
        width: GlobalStyles.width,
        height: Theme.isIPhoneX ? NAV_BAR_HEIGHT_IOS + 40 : NAV_BAR_HEIGHT_ANDROID + 20,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: __IOS__ ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
        // backgroundColor: 'red',
        // shadowOffset:{
        //     width: 1,
        //     height: 0.5,
        // },
        // shadowColor: '#55ACEE',
        // shadowOpacity: 0.8,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 70,
        top: 0,
        right: 70,
        bottom: 0,
    },
    title: {
        fontSize: 18,
        color: '#fff',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    navBarButton: {
        alignItems: 'center',
    },
    statusBar: {
        height: __IOS__ ? STATUS_BAR_HEIGHT : 0,
    },
})