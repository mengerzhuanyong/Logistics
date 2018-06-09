'use strict';

import React, {Component} from 'react'
import {
    View,
    Text,
    Picker,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import Pickers from 'react-native-picker'
import NetRequest from './util/utilsRequest'
import NetApi from './constant/GlobalApi'
import SplashScreen from 'react-native-splash-screen'
import area from './asset/json/area.json'
import ModalPicker from 'react-native-modal-picker'

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: [
                {id: 1, name: '固体'},
                {id: 2, name: '液体'},
                {id: 3, name: '易碎品'},
            ],
            startArea: [],
            area: [],
            textInputValue: ''
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        SplashScreen.hide();
        this.loadNetData();
        // this.createCategory();
    }

    updateState= (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = () => {
        let url = NetApi.orderTips + '1';
        this.netRequest.fetchGet(url)
            .then( result => {
                if (result && result.code == 1) {
                    this.updateState({
                        // category: result.data.cate,
                    })
                }
            })
            .catch( error => {
                console.log('获取出错', error);
            })
    }

    createCategory = () => {
        let {category} = this.state;
        let data = [];
        let len = category.length;
        for (let i = 0; i < len; i++) {
            let cate = category[i].name;
            data.push(cate);
        }
        console.log('data', data);
        return data;
    }

    showCatePicker = (type) => {
        Pickers.init({
            // pickerData: [1,2,3,4],
            pickerData: this.createCategory(),
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '商品类型选择',
            selectedValue: [],
            onPickerConfirm: pickedValue => {
                this.updateState({
                    category: pickedValue
                })
                console.log(pickedValue);
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {
                this.updateState({
                    category: pickedValue
                })
            }
        });
        Pickers.show();
    }

    createAreaData = () => {
        let data = [];
        let len = area.length;
        for (let i = 0; i < len; i++) {
            let city = [];
            let cityLen = area[i]['city'].length;
            for (let j = 0; j < cityLen; j++) {
                let district = {};
                district[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(district);
            }

            let province = {};
            province[area[i]['name']] = city;
            data.push(province);
        }
        return data;
    }

    showAreaPicker = (type) => {
        Pickers.init({
            pickerData: this.createAreaData(),
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '地区选择',
            selectedValue: [],
            onPickerConfirm: pickedValue => {
                this.updateState({
                    area: pickedValue
                })
            },
            onPickerCancel: pickedValue => {

            },
            onPickerSelect: pickedValue => {
                this.updateState({
                    area: pickedValue
                })
            }
        });
        Pickers.show();
    }

    onValueChange = (flag, value) => {
        if (flag == 1) {
            this.setState({
                selected: value
            });
        } else {
            this.setState({
                dropdown: value
            });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style = {styles.inputItemConTextView}
                    onPress = {() => this.showCatePicker()}
                >
                    <Text style={styles.text}>{'请选择分类'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {styles.inputItemConTextView}
                    onPress = {() => this.showAreaPicker()}
                >
                    <Text style={styles.text}>{'请选择目的地'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f60',
    },
	text: {
        marginTop: 10,
		fontSize: 15,
        color: '#fff',
	},
    picker: {
        width: 100,
    },
})
