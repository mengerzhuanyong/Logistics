/**
 * 速芽物流用户端 - HotNews
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {Image, Platform, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Carousel} from 'teaset'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

const img_url = GlobalIcons.banner1;
const isIos = Platform.OS == 'ios';

export default class HotNews extends Component {

    constructor(props) {
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

    componentWillReceiveProps(nextProps) {
        // consoleLog('', nextProps);
        this.updateState({
            hotNews: nextProps.hotNewsData
        })
    }

    componentWillUnmount() {
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
        if (row.length <= 0) {
            return;
        }
        let sliders = row.map((obj, index) => {
            return (
                <TouchableOpacity
                    style={GlobalStyles.bannerViewWrap}
                    key={"bubble_" + index}
                    activeOpacity={1}
                    onPress={() => {
                    }}
                >
                    <View style={GlobalStyles.bannerViewWrap}>
                        <Image source={{uri: obj.logo}} style={styles.hotNewsItemPicture}/>
                    </View>
                </TouchableOpacity>
            )
        });
        return sliders;
    };

    render() {
        const {hotNews} = this.state;
        return (
            <View style={[styles.container]}>
                <Image source={GlobalIcons.icon_hot_news} style={styles.hotNewsTitleIcon}/>
                <Carousel
                    horizontal={false}
                    interval={4000}
                    style={styles.bannerContainer}
                >
                    {this.renderSlider(hotNews)}
                </Carousel>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    hotNewsTitleIcon: {
        width: 45,
        height: 45,
        marginLeft: 15,
        marginRight: 5,
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