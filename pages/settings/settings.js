// 获取应用实例
const app = getApp()

// 默认设置
const defaultStyle = {
  foreground: '#000000',
  background: '#ffffff',
  size: 300,
  margin: 10
}

Page({
  data: {
    style: { ...defaultStyle },
    sizeLimits: [1, 2, 3, 4, 5],
    sizeLimitIndex: 1 // 默认2MB
  },

  onLoad() {
    // 加载保存的设置
    const style = wx.getStorageSync('qrcode_style')
    if (style) {
      this.setData({ style })
    }

    const sizeLimitIndex = wx.getStorageSync('size_limit_index')
    if (sizeLimitIndex !== '') {
      this.setData({ sizeLimitIndex })
    }
  },

  // 处理前景色变化
  handleForegroundChange(e) {
    const foreground = e.detail.value
    this.updateStyle('foreground', foreground)
  },

  // 处理背景色变化
  handleBackgroundChange(e) {
    const background = e.detail.value
    this.updateStyle('background', background)
  },

  // 处理大小变化
  handleSizeChange(e) {
    const size = e.detail.value
    this.updateStyle('size', size)
  },

  // 处理边距变化
  handleMarginChange(e) {
    const margin = e.detail.value
    this.updateStyle('margin', margin)
  },

  // 更新样式
  updateStyle(key, value) {
    const style = { ...this.data.style, [key]: value }
    this.setData({ style })
    
    // 保存到全局和本地存储
    app.globalData.qrcodeStyle = style
    wx.setStorageSync('qrcode_style', style)
  },

  // 处理图片大小限制变化
  handleSizeLimitChange(e) {
    const sizeLimitIndex = e.detail.value
    this.setData({ sizeLimitIndex })
    wx.setStorageSync('size_limit_index', sizeLimitIndex)
  },

  // 联系开发者
  contactDeveloper() {
    wx.showModal({
      title: '联系开发者',
      content: '如有问题或建议，请发送邮件至：your.email@example.com',
      showCancel: false
    })
  },

  // 重置设置
  resetSettings() {
    wx.showModal({
      title: '提示',
      content: '确定要恢复默认设置吗？',
      success: (res) => {
        if (res.confirm) {
          // 重置样式
          this.setData({
            style: { ...defaultStyle },
            sizeLimitIndex: 1
          })
          
          // 更新全局和本地存储
          app.globalData.qrcodeStyle = defaultStyle
          wx.setStorageSync('qrcode_style', defaultStyle)
          wx.setStorageSync('size_limit_index', 1)

          wx.showToast({
            title: '已恢复默认设置',
            icon: 'success'
          })
        }
      }
    })
  }
}) 