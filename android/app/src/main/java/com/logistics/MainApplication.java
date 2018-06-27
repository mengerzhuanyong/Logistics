package com.logistics;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;
import com.beefe.picker.PickerViewPackage;
import com.yunpeng.alipay.AlipayPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import cn.reactnative.modules.qq.QQPackage;
import com.horcrux.svg.SvgPackage;
import com.yusha.customKeyboard.RNCustomKeyboardPackage;
import com.theweflex.react.WeChatPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactlibrary.RNSyanImagePickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  // 设置为 true 将不弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将不打印 log
  private boolean SHUTDOWN_LOG = true;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNSyanImagePickerPackage(),
          new BaiduMapPackage(getApplicationContext()),
          new PickerViewPackage(),
          new AlipayPackage(),
          new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
          new QQPackage(),
          new SvgPackage(),
          new RNCustomKeyboardPackage(),
          new WeChatPackage(),
          new RNSpinkitPackage(),
          new SplashScreenReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
