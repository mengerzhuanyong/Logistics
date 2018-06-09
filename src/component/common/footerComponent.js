/**
 * 速芽物流用户端 - FooterComponent
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
import PropTypes from 'prop-types'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

// const FooterComponent = ({status}) => {
export default FooterComponent = ({status}) => {
	// console.log(status);
    if (status === 1) {
        return (
            <View style={[styles.container, styles.endContainer]}>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
                <Text style={styles.titleName}>已经到底了</Text>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
            </View>
        );
    } else if(status === 2) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>正在加载更多数据...</Text>
            </View>
        );
    } else if(status === 0){
        return (
            <View />
        );
    }
}

FooterComponent.propTypes = {
    status: PropTypes.number
}

FooterComponent.defaultProps = {
    status: 0,
};

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
    title: {
        color: '#999',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5,
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
});

// export default FooterComponent;