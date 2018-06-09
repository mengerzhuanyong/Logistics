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

export default class hotNews extends Component {

    constructor(props){
        super(props);
        this.state = {
            swiperShow: false,
            hotNews: this.props.hotNewsData,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        hotNews: [],
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.hotNews != nextState.hotNewsData) {
    //         return true;
    //     }
    //     return false;
    // }

    componentWillReceiveProps(nextProps){
        // consoleLog('', nextProps);
        this.updateState({
            hotNews: nextProps.hotNewsData
        })
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    updateState = (state) => {
        if (!this) { return };
        this.setState(state);
    }

    loadNetData = () => {

    }

    renderHotNewsView = (row) => {
        if(this.state.swiperShow) {
            if(row.length <= 0) {
                return;
            }
            let hotNews = row.map((obj,index)=>{
                return (
                    <TouchableOpacity
                        style={GlobalStyles.bannerViewWrap}
                        key={"bubble_"+index}
                        activeOpacity = {1}
                        onPress={() => {}}
                    >
                        <View style={GlobalStyles.bannerViewWrap}>
                            <Image source={{uri: obj.logo}} style={styles.hotNewsItemPicture} />
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
                    showsPagination={false}
                    autoplayTimeout={8}
                    height={isIos ? 60 : 60}
                    width={GlobalStyles.width}
                    style={{paddingTop:0,marginTop:0}}
                    lazy={true}
                    dot = {<View style={GlobalStyles.bannerDot} />}
                    activeDot = {<View style={GlobalStyles.bannerActiveDot} />}
                >
                    {hotNews}
                </Swiper>
            )
        }
    }

    render(){
        const { hotNews } = this.state;
        return (
            <View style={[styles.container]}>
                <View style={[styles.bannerContainer]}>
                    {this.renderHotNewsView(hotNews)}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#fff',
    },
    bannerContainer: {
        flex: 1,
        marginHorizontal: 15,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginVertical: 20,
        backgroundColor: '#fff',
    },
    bannerViewWrap: {
        flex: 1,
    },
    hotNewsItemPicture: {
        flex: 1,
        resizeMode: 'cover',
    }
});