/**
 * 速芽物流用户端 - BANNER
 * http://menger.me
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

export default class NavigationItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            onPushNavigator: this.props.onPushNavigator,
            navigatorName: this.props.navigatorName,
            navigatorIcon: this.props.navigatorIcon,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        onPushNavigator: () => {},
        navigatorName: '',
        navigatorIcon: '',
    }

    componentDidMount() {
        // console.log("接受参数", this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.navigatorName != nextState.navigatorName) {
            return true;
        }
        return false;
    }

    updateState = (state) => {
        if (!this) { return };
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    render(){
        const { onPushNavigator, navigatorName, navigatorIcon, style, iconStyle, titleStyle } = this.props;
        return (
            <TouchableOpacity
                style = {[styles.navigationItemView, style]}
                onPress = {onPushNavigator}
            >
                <Image source={navigatorIcon} style={[styles.navigationIcon, iconStyle]} />
                <Text style={[styles.navigationName, titleStyle]}>{navigatorName}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    navigationItemView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (GlobalStyles.width - 130) / 3,
        marginTop: 15,
    },
    navigationIcon: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    navigationName: {
        color: '#333',
        marginTop: 8,
    },
});