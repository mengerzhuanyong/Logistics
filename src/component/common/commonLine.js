/**
 * 汇了金融 - CommonLine
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

import GlobalStyles from '../../constant/GlobalStyle'

export class VerticalLine extends Component {

    static defaultProps = {
        lineStyle: {},
    };

    render(){
        let {lineStyle} = this.props;
        return (
            <View style={[styles.verLine, lineStyle]} />
        );
    }
}

export class HorizontalLine extends Component {

    static defaultProps = {
        lineStyle: {},
    };

    render(){
        let {lineStyle} = this.props;
        return (
            <View style={[styles.horLine, lineStyle]} />
        );
    }
}

const styles = StyleSheet.create({
    verLine: {
        width: 1,
        backgroundColor: '#f5f5f5'
    },
    horLine: {
        height: 1,
        backgroundColor: '#f5f5f5'
    },
});