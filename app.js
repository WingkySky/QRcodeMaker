// app.js
App({
  globalData: {
    userInfo: null,
    // 二维码样式配置
    qrcodeStyle: {
      foreground: '#000000',
      background: '#ffffff',
      margin: 10,
      size: 300
    },
    // 历史记录
    history: []
  },
  
  onLaunch() {
    // 从本地存储加载历史记录
    const history = wx.getStorageSync('qrcode_history') || []
    this.globalData.history = history

    // 从本地存储加载样式配置
    const style = wx.getStorageSync('qrcode_style')
    if (style) {
      this.globalData.qrcodeStyle = style
    }
  }
}) 