/**
 * 速芽物流用户端 - shopTagsModalContent
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

export default class shopTagsModalContent extends Component {

    constructor(props) {
        super(props);
        this.state =  {
        }
    }

    static defaultProps = {
    }

    renderStar = (data) => {
    }

    render(){
        const { star, titleStyle, pointStyle } = this.props;

        return (
            <View style={styles.container}>
                <Text style={[styles.shopStarNum, pointStyle]}>123123123</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
});