'use strict';

//import liraries
import React from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Platform, Text, View, Image } from 'react-native'
import PropTypes from 'prop-types'
import InteractionManager from './InteractionManager'
import GlobalIcons from '../../constant/GlobalIcon'
import GlobalStyles from '../../constant/GlobalStyle'

const __IOS__ = Platform.OS === 'ios';
const __ANDROID__ = Platform.OS === 'android';

// 上拉刷新的状态
const EndReachedStatus = {
    FIRST_LOADED: 'FIRST_LOADED', // 第一次加载
    START_LOADED: 'START_LOADED',  // 已经开始刷新
    WAITING_LOADING: 'WAITING_LOADING',  // 等待着刷新
    ALL_LOADED: 'ALL_LOADED',
};

class FlatListView extends React.PureComponent {


    static propTypes = {
        ...FlatList.propTypes,

        initialRefresh: PropTypes.bool,//列表初始化时是否显示刷新按钮,请求数据结束后需要手动调用stopRefresh方法
        enableLoadMore: PropTypes.bool, //是否能上拉加载
        enableRefresh: PropTypes.bool, //是否能下拉刷新

        onRefresh: PropTypes.func,
        onEndReached: PropTypes.func,

        refreshableColors: PropTypes.array,
        refreshableProgressBackgroundColor: PropTypes.string,
        refreshableSize: PropTypes.any,
        refreshableTintColor: PropTypes.string,
        refreshableTitle: PropTypes.string,

    };
    static defaultProps = {
        ...FlatList.defaultProps,

        initialRefresh: false,
        enableRefresh: true,
        enableLoadMore: true,

        initialNumToRender: 8,

        refreshableColors: ['green'],
        refreshableTitle: '  正在加载...',
    };

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: props.initialRefresh,
            isEndReached: false,
        };
        if (__IOS__) {
            // 解决列表初始化时显示刷新按钮导致的bug
            this._currentEndReachedStatus = props.data.length === 0 && props.initialRefresh ? EndReachedStatus.FIRST_LOADED : EndReachedStatus.WAITING_LOADING;
        } else {
            this._currentEndReachedStatus = EndReachedStatus.WAITING_LOADING
        }
        this._currentContentSize = { contentWidth: 0, contentHeight: 0 }
        this._currentListSize = { width: 0, height: 0 }
    }

    setNativeProps(props) {
        if (this._flatListRef) {
            this._flatListRef.setNativeProps(props);
        }
    }
    scrollToOffset = (option = { offset: 0, animated: true }) => {
        if (this._flatListRef) {
            this._flatListRef.scrollToOffset(option)
        }
    };
    scrollToIndex = (option = { animated: true, index: 0, viewOffset: 0, viewPosition: 0 }) => {
        if (this._flatListRef) {
            this._flatListRef.scrollToIndex(option)
        }
    };
    scrollToItem = (option = { animated: true, item: 0, viewPosition: 0 }) => {
        if (this._flatListRef) {
            this._flatListRef.scrollToItem(option)
        }
    };
    scrollToEnd = (option = { animated: true }) => {
        if (this._flatListRef) {
            this._flatListRef.scrollToEnd(option)
        }
    };
    flashScrollIndicators = () => {
        if (this._flatListRef) {
            this._flatListRef.flashScrollIndicators();
        }
    };
    getScrollResponder = () => {
        if (this._flatListRef) {
            return this._flatListRef.getScrollResponder();
        }
    };
    getScrollableNode = () => {
        if (this._flatListRef) {
            return this._flatListRef.getScrollableNode();
        }
    };
    getFlatListResponder = () => {
        if (this._flatListRef) {
            return this._flatListRef
        }
    };
    getContentSize = () => {
        return this._currentContentSize
    };

    _onRefresh = () => {
        this.startRefresh();
        // console.log('_onRefreshzzzz')
        this.props.onRefresh && this.props.onRefresh(this.stopRefresh)
    };
    startRefresh = () => {
        if (!this.state.isRefreshing) {
            // console.log('startRefresh')
            if (this._currentEndReachedStatus === EndReachedStatus.ALL_LOADED) {
                this._currentEndReachedStatus = EndReachedStatus.WAITING_LOADING;
            }
            this.setState({ isRefreshing: true });
        }
    };
    stopRefresh = () => {
        if (this.state.isRefreshing) {
            InteractionManager.runAfterInteractions(() => {
                // console.log('stopRefresh-runAfterInteractions')
                this.setState({ isRefreshing: false });
            }) // 交互手势结束后再执行
        }
    };
    _renderRefreshControl = () => {
        const {
            refreshableColors, refreshableProgressBackgroundColor,
            refreshableSize, refreshableTintColor, refreshableTitle,
        } = this.props;
        // console.log('刷新状态',this.state.isRefreshing)
        return (
            <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={refreshableColors}
                progressBackgroundColor={refreshableProgressBackgroundColor}
                size={refreshableSize}
                tintColor={refreshableTintColor}
                title={refreshableTitle}
            />
        )
    };
    _onEndReached = (params) => {
        const { data, enableLoadMore } = this.props;
        const { isRefreshing, isEndReached } = this.state;
        // console.log('data-->', data, 'enableLoadMore-->', enableLoadMore, 'isRefreshing-->', isRefreshing, 'isEndReached-->', isEndReached, );
        // 统一解决_onEndReached回调不正确的Bug,以下条件满足之一都不会触发startEndReached，
        // 都不满足时进入下一个条件判断
        // 注意：以下每个if的顺序要一致，不能随意更换
        if (!enableLoadMore || data.length === 0
            || this._currentEndReachedStatus === EndReachedStatus.START_LOADED
            || this._currentEndReachedStatus === EndReachedStatus.ALL_LOADED
        ) {
            return
        }
        // 解决如果列表一开始显示刷新按钮,_onEndReached回调不正确的Bug
        if (this._currentEndReachedStatus === EndReachedStatus.FIRST_LOADED) {
            this._currentEndReachedStatus = EndReachedStatus.WAITING_LOADING
            return
        }
        // bug
        if (isRefreshing || isEndReached) {
            return
        }
        // console.log('contentHeight', this._currentContentSize.contentHeight)
        // console.log('height', this._currentListSize.height)
        // 解决内容视图不够列表的高度时,_onEndReached回调不正确的Bug，必须放在FIRST_LOADED后面
        if (this._currentContentSize.contentHeight <= this._currentListSize.height) {
            return
        }
        // console.log('_onEndReached')
        this.startEndReached();
        this.props.onEndReached && this.props.onEndReached(this.stopEndReached)
    };
    startEndReached = () => {
        if (!this.state.isEndReached) {
            // console.log('startEndReached');
            this._currentEndReachedStatus = EndReachedStatus.START_LOADED;
            this.setState({ isEndReached: true }, () => {
                // 问题所在，不能显示到视图最底层
                // console.log('this._currentContentSize', this._currentContentSize.contentHeight)
                // let offset = this._currentContentSize.contentHeight - this._currentListSize.height + 30
                // console.log('this.offset', offset)
                // this.scrollToOffset({ offset: offset, animated: true })
            })
        }
    };
    stopEndReached = (option = { allLoad: false }) => {
        if (this.state.isEndReached) {
            // console.log('stopEndReached', option)
            InteractionManager.runAfterInteractions(() => {
                if (option.allLoad === true) {
                    this._currentEndReachedStatus = EndReachedStatus.ALL_LOADED;
                } else {
                    this._currentEndReachedStatus = EndReachedStatus.WAITING_LOADING;
                }
                this.setState({ isEndReached: false })
            }) // 交互手势结束后再执行
            // setTimeout(() => {

            // }, 200); 
        }
    };
    _renderFooter = () => {
        const { data } = this.props;
        const { isEndReached } = this.state;
        const status = this._currentEndReachedStatus === EndReachedStatus.ALL_LOADED;
        if (isEndReached === false || data.length === 0) {
            if (status) {
                return <FooterComponent loading={this.state.isEndReached} allLoad={status} />
            }
            return null
        } else if (isEndReached) {
            return <FooterComponent loading={this.state.isEndReached} allLoad={status} />
        }
        return null
    };
    _renderSeparator = () => {
        return null
    };
    _renderEmptyView = () => {
        // console.log('_renderEmptyView')
        return (
            <EmptyComponent />
        )
    };
    _onContentSizeChange = (contentWidth, contentHeight) => {
        const { onContentSizeChange } = this.props
        this._currentContentSize = { contentWidth, contentHeight }
        onContentSizeChange && onContentSizeChange(contentWidth, contentHeight)
    };
    _onLayout = (event) => {
        const { onLayout } = this.props
        // console.log('event.nativeEvent.layout.height',event.nativeEvent.layout.height)
        if (event.nativeEvent.layout.height != 0 && event.nativeEvent.layout.width != 0) {
            this._currentListSize = { width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height }
        }
        onLayout && onLayout(event)
    };
    _captureRef = (v) => {
        this._flatListRef = v
    };

    render() {
        const { onRefresh, onEndReached, onLayout, onContentSizeChange, enableRefresh, enableLoadMore, ...others } = this.props;
        // console.log('render');
        return (
            <FlatList
                ref={this._captureRef}
                onLayout={this._onLayout}
                removeClippedSubviews={true}
                onContentSizeChange={this._onContentSizeChange}
                ListEmptyComponent={this._renderEmptyView}
                ListFooterComponent={enableLoadMore ? this._renderFooter : null}
                refreshControl={enableRefresh ? this._renderRefreshControl() : null}
                {...others}
                onEndReachedThreshold={0.1} // 必须在{...}后面，否则就会出问题。也不知道是为什么，
                onEndReached={this._onEndReached}
            />
        );
    }
}


// create a component
class FooterComponent extends React.PureComponent {

    static propTypes = {
        loading: PropTypes.bool,
        allLoad: PropTypes.bool,// 是否加载完毕
    };
    static defaultProps = {
        loading: false,
        allLoad: false
    };

    render() {
        const { loading, allLoad } = this.props;
        // console.log('FooterComponent');
        return (
            <View style={styles.footerContainer}>
                {!allLoad ? (
                    <View style={styles.indicatorContainer}>
                        <ActivityIndicator
                            animating={loading}
                            // color='red'
                            size="small"
                            hidesWhenStopped={true}
                        />
                        <Text style={styles.footerText}>正在加载...</Text>
                    </View>) : (
                        <View style={[styles.container, styles.endContainer]}>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                            <Text style={styles.titleName}>已经到底了</Text>
                            <View style={[GlobalStyles.horLine, styles.horLine]} />
                        </View>
                    )}
            </View>
        );
    }
}

// create a component
class EmptyComponent extends React.PureComponent {
    static propTypes = {

    };
    static defaultProps = {

    };

    render() {

        return (
            <View style={styles.emptyContainer}>
                <Image style={styles.emptyImage} source={GlobalIcons.icon_no_record} />
                <Text style={styles.emptyText}>暂无数据</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    endContainer: {
        height: 30,
    },
    horLine: {
        width: 20,
        backgroundColor: '#ddd',
    },
    titleName: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 20,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    indicatorContainer: {
        // marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        marginLeft: 10,
        height: 30,
        lineHeight: 30,
        fontSize: 13,
        color: '#999999',
        // backgroundColor: 'green',
        // marginBottom: 10,
    },
    emptyContainer: {
        height: GlobalStyles.height * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue',
    },
    emptyText: {
        marginTop: 10,
        color: '#cdcdcd',
        fontSize: 13,
    },
    emptyImage: {
        width: 80,
        height: 80
    }
});

//make this component available to the app
export default FlatListView;
