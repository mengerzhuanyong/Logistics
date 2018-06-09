/**
 * 速芽物流用户端 - 数据操作模块
 * https://menger.me
 * @大梦
 */

import {
    AsyncStorage,
} from 'react-native';
import NetApi from '../constant/GlobalApi'
import GlobalStyles from '../constant/GlobalStyle'

const regular = /{"code/;

const loggerTrueColor = 'color: #1ba01b';
const loggerFalseColor = 'color: #f00';

export default class DataRepository {

    /**
     * 获取网络数据
     * @param url
     * @returns {Promise}
     */
    fetchGet(url, print = false) {
        url = NetApi.base + url;
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.text())
                .then((result) => {
                    if (__DEV__ && print || !regular.test(result)) {
                        try {
                            console.group('%c请求数据', loggerTrueColor);
                            console.log('%c请求接口——>>', loggerTrueColor, url);
                            if ( !regular.test(result)) {
                                console.log('%c错误信息——>>', loggerFalseColor, result);
                            }
                            console.log('%c请求结果——>>', loggerTrueColor, JSON.parse(result));
                            console.groupEnd();
                        } catch (e) {
                            // 非调试模式，无法使用group
                        }
                    }
                    result = JSON.parse(result);
                    if (!result) {
                        reject(new Error('responseData is null'));
                        return;
                    }
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                })
                if (__DEV__ && print) {
                    try {
                        console.groupEnd();
                    } catch (e) {
                        // 非调试模式，无法使用group
                    }
                }
        })
    }

    /**
     * 提交数据
     * @param url
     * @param data
     * @returns {Promise}
     */
    fetchPost(url, data, print = false) {
        url = NetApi.base + url;
        return new Promise((resolve, reject) => {
            fetch( url, {
                    method: 'POST',
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then((response) => response.text())
                .then((result) => {
                    if (__DEV__ && print || !regular.test(result)) {
                        try {
                            console.group('%c请求数据', loggerTrueColor);
                            console.log('%c请求接口——>>', loggerTrueColor, url);
                            console.log('%c请求参数——>>', loggerTrueColor, data);
                            if ( !regular.test(result)) {
                                console.log('%c错误信息——>>', loggerFalseColor, result);
                            }
                            console.log('%c请求结果——>>', loggerTrueColor, JSON.parse(result));
                            console.groupEnd();
                        } catch (e) {
                            // 非调试模式，无法使用group
                        }
                    }
                    result = JSON.parse(result);
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                })
                if (__DEV__ && print) {
                    try {
                        console.groupEnd();
                    } catch (e) {
                        // 非调试模式，无法使用group
                    }
                }
        })
    }

}