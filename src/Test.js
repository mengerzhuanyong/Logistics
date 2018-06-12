import React, {Component} from 'react'
import {
    View,
    Button,
    StyleSheet,
} from 'react-native'

import {Geolocation} from 'react-native-baidu-map'
import SplashScreen from 'react-native-splash-screen'

export default class BaiduMap extends Component {
    constructor() {
        super();
        this.state = {
            lat: '',
            lng: '',
        };
    }

    componentDidMount() {
        SplashScreen.hide();
        this.getLocation()
    }

    getLocation = () => {
        Geolocation.getCurrentPosition()
            .then(data => {
                // console.log(data);
                this.setState({
                    lat: data.latitude,
                    lng: data.longitude,
                });
            })
            .catch(e => {
                // console.log(e, '获取地理位置失败，请稍后重试！');
            })
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Button
                        style={styles.locationBtn}
                        title="获取定位信息"
                        onPress={() => this.getLocation()}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f60',
        justifyContent: 'center',
    },
    locationBtn: {},
});