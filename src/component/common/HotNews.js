/**
 * 速芽物流用户端 - HotNews
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
    ScrollView,
    TouchableOpacity
} from 'react-native'
import {Carousel} from 'teaset'
import Swiper from 'react-native-swiper'
import { toastShort, consoleLog } from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

const img_url = GlobalIcons.banner1;
const isIos = Platform.OS == 'ios';

export default class HotNews extends Component {

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
    };

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
        if (!this) {
            return
        }
        this.setState(state);
    };

    loadNetData = () => {

    };

    renderSlider = (row) => {
        if(row.length <= 0) {
            return;
        }
        let sliders = row.map((obj,index)=>{
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
        return sliders;
    };

    render(){
        const { hotNews } = this.state;
        return (
            <View style={[styles.container]}>
                <ScrollView>
                    <Carousel
                        horizontal={false}
                        interval={4000}
                        style={styles.bannerContainer}
                    >
                        {this.renderSlider(hotNews)}
                    </Carousel>
                </ScrollView>
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
        height: 60,
        overflow: 'hidden',
        marginVertical: 20,
        // borderRadius: 30,
        // marginHorizontal: 15,
        // backgroundColor: '#123',
    },
    bannerViewWrap: {
        flex: 1,
    },
    hotNewsItemPicture: {
        flex: 1,
        resizeMode: 'contain',
    }
});