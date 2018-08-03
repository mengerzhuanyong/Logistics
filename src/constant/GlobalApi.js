/**
 * 速芽物流用户端 - API
 * https://menger.me
 * UpdateTime: 2017/12/25 14:55
 * @大梦
 */


module.exports = {

    wechatAppid: 'wx276cb83a93ce9958',
    alipayAppid: '2018031002347396',

    base: 'http://suya.3todo.com/',
    // base: 'http://suya.com/index/',
    // base: 'http://suya.com.192.168.2.174.xip.io/index/',
    // base: 'http://192.168.2.120/',

    index: 'user/index/index',                                                                          // 首页
    navigations: 'user/navigations/index',                                                              // 首页
    orderNavigation: 'user/navigations/orderNavigations',                                                              // 首页
    postLongitude: 'user/index/navigation',                                                             // 首页
    getBanner: 'user/index/banner',                                                                     // 首页

    phone: 'user/index/mobile',

    onlineStatus: 'user/login/index',                                                                        // 登录
    loginIn: 'user/login/login',                                                                        // 登录
    wechatLogin: 'user/loginApi/wxlogin',
    wechatTokenLogin: 'user/loginApi/wexinToken',
    qqLogin: 'user/loginApi/qqlogin',
    logOut: 'user/login/logout',                                                                        // 退出
    register: 'user/login/register',                                                                    // 注册
    rePasswd: 'user/login/forget',                                                                      // 找回密码
    sendSMS: 'user/login/sendSMS',                                                                      // 找回密码
    sendPubSMS: 'user/login/sendPubSMS',                                                                // 找回密码
    protocol: 'user/login/protocol',                                                                    // 找回密码

    businessCollect: 'user/index/collect',
    businessList: 'user/index/store/',
    businessDetail: 'user/index/detail/id/',
    businessService: 'user/index/store_service',
    businessServiceAddress: 'user/index/service_points',

    orderSubmit: 'user/order/create',
    orderList: 'user/order/index/status/',
    orderCancel: 'user/order/cancelOrder/oid/',
    orderDetail: 'user/order/detail/id/',
    orderTips: 'user/order/cate/sid/',
    orderComment: 'user/order/evaluate',
    getPrice: 'user/order/compute_price',
    orderUpload: 'user/order/upload',
    orderWechatPay: 'pay/wx/unifiedorder/oid/',
    orderAliPay: 'pay/Alipay/appAlipay/oid/',
    orderOnDelivery: 'user/order/pay_order/oid/',
    flowProtocol: 'user/login/agreement',

    cooperate: 'user/index/getCoop',

    mine: 'user/personal/index/uid/',
    mineCoupon: 'user/order/coupon/uid/',
    mineCouponList: 'user/personal/coupon/uid/',
    mineFeedback: 'user/index/message',
    mineFeedbackReward: 'user/index/getMessage',
    mineAbout: 'user/index/getAbout',

    mineAddress: 'user/address/index/uid/',
    mineAddressAdd: 'user/address/add',
    mineAddressEdit: 'user/address/edit',
    mineAddressDel: 'user/address/del/id/',
    mineAddressDefault: 'user/address/set_default/id/',
    mineName: 'user/user/upName',
    minePhone: 'user/user/upMobile',
    mineEditPwd: 'user/user/editPwd',
    mineCollect: 'user/personal/collect/uid/',
    mineUploadAvatar: 'user/upfiles/upload',
    uploadImages: 'user/upfiles/uploadStore',
};