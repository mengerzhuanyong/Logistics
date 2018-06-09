/**
 * 速芽物流用户端 - 数据操作模块
 * https://menger.me
 * @大梦
 */

import { NavigationActions } from 'react-navigation'

export const routerReset = (content) => {
    setTimeout(() => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: content})
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }, 500)
};