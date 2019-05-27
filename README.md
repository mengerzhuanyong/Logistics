#  Logistics
	
###react-native-baidu-map
	1、BaseModule.h
	#import "RCTBridgeModule.h" -> #import <React/RCTBundleURLProvider.h>
	2、RCTBaiduMapView.h
	#import <React/RCTViewManager.h>
	#import <React/RCTConvert+CoreLocation.h>
	3、MapView.js
	PropTypes -> import PropTypes from 'prop-types';
	4、删除 BaiduMapPackage.java中的
	@Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

###react-native-yusha-customkeyboard
	1、CustomKeyboard.m
	#import <RCTText/RCTTextInput.h> -> #import "RCTTextInput.h"

###react-native-scrollable-tab-view
    // scrolltabbar.js 第62行
    if (offset.value === undefined) {
      offset.value = this.props.activeTab;
    }

###react-native-yunpeng-alipay
    删除 AlipayPackage.java中的
    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }
