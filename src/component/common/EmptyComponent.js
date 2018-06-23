/**
 * 速芽物流用户端 - EmptyComponent
 * https://menger.me
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

export default class EmptyComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emptyTips: this.props.emptyTips,
        }
    }

    static defaultProps = {
        emptyTips: '暂未找到相关商品！',
    }

    // componentWillReceiveProps(nextProps){
    //     this.setState({
    //         emptyTips: nextProps.emptyTips
    //     })
    // }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.state.emptyTips}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // height: 100,
        alignItems: 'center',
        paddingVertical: 30,
        // justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        color: '#888',
    }
});