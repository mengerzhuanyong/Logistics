/**
 * 速芽物流用户端 - Router
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    View,
} from 'react-native'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import GlobalStyles from '../constant/GlobalStyle'
import GlobalIcons from '../constant/GlobalIcon'

import stroage from '../store'
import '../store/Global'
import { consoleLog } from '../util/utilsToast'

import TabBarItem from '../component/common/TabBarItem'
import Root from '../index'

import Home from '../page/home'
import Order from '../page/order'
import Cooperate from '../page/cooperate'
import Mine from '../page/mine'
import Flow from '../page/flow'


import Login from '../page/login'
import Register from '../page/login/register'
import Repassword from '../page/login/repassword'

import OrderPayment from '../page/order/orderPayment'
import OrderDetail from '../page/order/orderDetail'
import OrderComment from '../page/order/orderComment'
import FlowProtocol from '../page/flow/protocol'

import CooperateDetail from '../page/cooperate/cooperateDetail'

import MineCoupon from '../page/mine/mineCoupon'
import MineCouponUsed from '../page/mine/mineCouponUsed'
import MineFeedBack from '../page/mine/mineFeedBack'
import MineFeedBackReward from '../page/mine/mineFeedBackReward'
import MineInfoSetting from '../page/mine/mineInfoSetting'
import MineInfoName from '../page/mine/mineInfoName'
import MineInfoPhone from '../page/mine/mineInfoPhone'
import MineInfoPwd from '../page/mine/mineInfoPwd'
import MineAbout from '../page/mine/mineAbout'
import MineAddressList from '../page/mine/mineAddressList'
import MineAddressAdd from '../page/mine/mineAddressAdd'
import MineAddressEdit from '../page/mine/mineAddressEdit'
import MineAddressShipperList from '../page/mine/mineAddressShipperList'
import MineAddressShipperAdd from '../page/mine/mineAddressShipperAdd'
import MineAddressShipperEdit from '../page/mine/mineAddressShipperEdit'
import MineCollect from '../page/mine/mineCollect'

import BusinessList from '../page/business'
import BusinessDetail from '../page/business/businessDetail'
import BusinessServiceList from '../page/business/businessServiceList'
import BusinessServiceAddList from '../page/business/businessServiceAddList'

const TabNavScreen = TabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarLabel: '首页',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        subScript = {false}
                        tintColor = {tintColor}
                        focused = {focused}
                        normalImage = {GlobalIcons.icon_tabbar_home}
                        selectedImage = {GlobalIcons.icon_tabbar_home_cur}
                    />
                ),
            }),
        },
        Order: {
            screen: Order,
            navigationOptions: ({ navigation }) => ({
                // header: null,
                title: '我的订单',
                tabBarLabel: '我的订单',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        subScript = {false}
                        tintColor = {tintColor}
                        focused = {focused}
                        normalImage = {GlobalIcons.icon_tabbar_order}
                        selectedImage = {GlobalIcons.icon_tabbar_order_cur}
                    />
                ),
            }),
        },
        Cooperate: {
            screen: Cooperate,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarLabel: '我要合作',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        subScript = {false}
                        tintColor = {tintColor}
                        focused = {focused}
                        normalImage = {GlobalIcons.icon_tabbar_cooperate}
                        selectedImage = {GlobalIcons.icon_tabbar_cooperate_cur}
                    />
                ),
            }),
        },
        Mine: {
            screen: Mine,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarLabel: '个人中心',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        subScript = {false}
                        tintColor = {tintColor}
                        focused = {focused}
                        normalImage = {GlobalIcons.icon_tabbar_mine}
                        selectedImage = {GlobalIcons.icon_tabbar_mine_cur}
                    />
                ),
            }),
        },
    },
    {
        initialRouteName: 'Home',
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        tabBarOptions: {
            activeTintColor: '#42b3ff',
            inactiveTintColor: '#808080',
            style: { backgroundColor: '#fff' },
            labelStyle: { fontSize: 12, marginBottom: 4,}
        },
    }

);

const App = StackNavigator(
    {
        TabNavScreen: {
            screen: TabNavScreen
        },
        Login: {
            screen: Login
        },
        Register: {
            screen: Register
        },
        Repassword: {
            screen: Repassword
        },
        BusinessList: {
            screen: BusinessList
        },
        BusinessDetail: {
            screen: BusinessDetail
        },
        BusinessServiceList: {
            screen: BusinessServiceList
        },
        BusinessServiceAddList: {
            screen: BusinessServiceAddList
        },
        Flow: {
            screen: Flow
        },
        FlowProtocol: {
            screen: FlowProtocol
        },
        OrderPayment: {
            screen: OrderPayment
        },
        OrderDetail: {
            screen: OrderDetail
        },
        OrderComment: {
            screen: OrderComment
        },
        CooperateDetail: {
            screen: CooperateDetail
        },
        MineCoupon: {
            screen: MineCoupon
        },
        MineCouponUsed: {
            screen: MineCouponUsed
        },
        MineFeedBack: {
            screen: MineFeedBack
        },
        MineFeedBackReward: {
            screen: MineFeedBackReward
        },
        MineInfoSetting: {
            screen: MineInfoSetting
        },
        MineInfoName: {
            screen: MineInfoName
        },
        MineInfoPhone: {
            screen: MineInfoPhone
        },
        MineInfoPwd: {
            screen: MineInfoPwd
        },
        MineAbout: {
            screen: MineAbout
        },
        MineAddressList: {
            screen: MineAddressList
        },
        MineAddressAdd: {
            screen: MineAddressAdd
        },
        MineAddressEdit: {
            screen: MineAddressEdit
        },
        MineAddressShipperList: {
            screen: MineAddressShipperList
        },
        MineAddressShipperAdd: {
            screen: MineAddressShipperAdd
        },
        MineAddressShipperEdit: {
            screen: MineAddressShipperEdit
        },
        MineCollect: {
            screen: MineCollect
        },
    },
    {
        mode: 'card',
        headerMode: 'screen',
        initialRouteName: 'TabNavScreen',
        // initialRouteName: 'Login',
        // initialRouteName: 'BusinessList',
        navigationOptions: ({navigation, screenProps}) => ({
            gesturesEnabled: true,
            header: null,
            headerBackTitle: null,
            headerTintColor: GlobalStyles.themeColor,
            headerStyle: {
                backgroundColor: '#fff',
            },
            showIcon: true,
            headerTitleStyle: {
                alignSelf: 'center',
            },
            headerRight: (
                <View />
            ),
        }),
        // transitionConfig:()=>({
        //     screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        // }),
    }
);
const defaultGetStateForAction = App.router.getStateForAction;

App.router.getStateForAction = (action, state) => {
    if (global.user) {
        if ((action.routeName === 'Flow' && !global.user.loginState) || (action.routeName === 'Order' && !global.user.loginState) ) {
            this.routes = [
                ...state.routes,
                {
                    key: 'id-' + Date.now(),
                    routeName: 'Login',
                    params: {
                        name: 'name1'
                    }
                },
            ];
            return {
                ...state,
                routes,
                index: this.routes.length - 1,
            };
        }
    }
    return defaultGetStateForAction(action, state);
};

export default App;