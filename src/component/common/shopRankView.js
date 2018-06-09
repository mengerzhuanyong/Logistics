/**
 * 速芽物流用户端 - ShopRankView
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

export default class ShopRankView extends Component {

    constructor(props) {
        super(props);
        this.state =  {
        }
    }

    static defaultProps = {
        star: {
            tens_digit: 0,
            digit: 0,
        },
        titleStyle: {},
        iconStyle: {},
        pointStyle: {},
    }

    renderStar = (data) => {
        let {iconStyle} = this.props;
        let stars = [];
        let length = '';
        let digit = parseInt(data.digit);
        let tens_digit = parseInt(data.tens_digit);

        if (tens_digit == 0) {
            let starItem = <Image key={1} source={GlobalIcons.icon_star_gray} style={[GlobalStyles.shopStarIcon, iconStyle]} />;
            stars.push(starItem);
            return stars;
        }else if (tens_digit == 5) {
            for (var i = 0; i < 5; i++) {
                let starItem = <Image key={i} source={GlobalIcons.icon_star_red} style={[GlobalStyles.shopStarIcon, iconStyle]} />;
                stars.push(starItem);
            };
            return stars;
        }
        if (digit >= 7) {
            length = tens_digit + 1;
            // console.log(length);
        }else {
            length = tens_digit;
        }
        for (var i = 0; i < length; i++) {
            let starItem = <Image key={i} source={GlobalIcons.icon_star_red} style={[GlobalStyles.shopStarIcon, iconStyle]} />;
            stars.push(starItem);
        };
        if ( digit == 0) {
            return stars;
        }
        if ( digit < 7) {
            let starItem = <Image key={i} source={GlobalIcons.icon_star_half} style={[GlobalStyles.shopStarIcon, iconStyle]} />;
            stars.push(starItem);
        }
        return stars;
    }

    render(){
        const { star, titleStyle, pointStyle } = this.props;

        return (
            <View style={styles.container}>
                <Text style={[styles.shopStarTitle, titleStyle]}>评分：</Text>
                <View style={GlobalStyles.shopStarCon}>{this.renderStar(star)}</View>
                <Text style={[styles.shopStarNum, pointStyle]}>{star.tens_digit}.{star.digit}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopStarTitle: {
        color: '#333',
        fontSize: 12,
    },
    shopStarNum: {
        fontSize: 13,
        marginLeft: 1,
        color: '#f00',
    },
});