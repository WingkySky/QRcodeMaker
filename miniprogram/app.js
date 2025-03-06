// app.js
App({
  globalData: {
    userInfo: null,
    // 存储全局配置
    config: {
      maxTextLength: 500,  // 文字最大长度
      maxImageSize: 2048,  // 图片最大大小（KB）
      qrCodeStyles: {
        // 预设二维码样式
        default: {
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
        }
      }
    }
  },
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true
      });
    }
  }
}); 