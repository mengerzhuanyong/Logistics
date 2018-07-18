/**
 * 速芽物流用户端 - BANNER
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Platform,
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

const img_url = GlobalIcons.banner1;
const isIos = Platform.OS == 'ios';

export default class Banner extends Component {

    constructor(props){
        super(props);
        this.state = {
            swiperShow: false,
            banners: this.props.bannerData,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        bannerData: [],
    };

    componentDidMount() {
        this.timer =  setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.banners != nextState.bannerData) {
    //         return true;
    //     }
    //     return false;
    // }

    componentWillReceiveProps(nextProps){
        this.updateState({
            banners: nextProps.bannerData
        })
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    updateState = (state) => {
        if (!this) {
            return
        }
        this.setState(state);
    };

    loadNetData = () => {

    };

    renderBanner = (row) => {
        if (this.state.swiperShow) {
            if (row.length <= 0) {
                return;
            }
            let banners = row.map((obj, index) => {
                return (
                    <TouchableOpacity
                        style={GlobalStyles.bannerViewWrap}
                        key={"bubble_" + index}
                        activeOpacity={1}
                        onPress={() => {
                        }}
                    >
                        <View style={GlobalStyles.bannerViewWrap}>
                            <Image source={{uri: obj.logo}} style={GlobalStyles.bannerImg}/>
                        </View>
                    </TouchableOpacity>
                )
            });
            return (
                <Swiper
                    index={0}
                    loop={true}
                    autoplay={true}
                    horizontal={true}
                    removeClippedSubviews={false}
                    showsPagination={true}
                    autoplayTimeout={6}
                    height={GlobalStyles.width / 2}
                    width={GlobalStyles.width}
                    style={{paddingTop: 0, marginTop: 0}}
                    lazy={true}
                    dot={<View style={GlobalStyles.bannerDot}/>}
                    activeDot={<View style={GlobalStyles.bannerActiveDot}/>}
                >
                    {banners}
                </Swiper>
            )
        }
    };

    render(){
        const { banners } = this.state;
        return (
            <View style={[GlobalStyles.bannerContainer, styles.container]}>
                {this.renderBanner(banners)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: isIos ? 0 : -20,
    }
});