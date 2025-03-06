const app = getApp()

Page({
  data: {
    config: {
      maxTextLength: 500,
      maxImageSize: 2048
    },
    qrCodeStyle: {
      width: 400,
      colorDark: '#000000',
      colorLight: '#ffffff'
    }
  },

  onLoad() {
    // 加载全局配置
    this.setData({
      config: app.globalData.config,
      qrCodeStyle: app.globalData.config.qrCodeStyles.default
    })
  },

  // 显示颜色选择器
  showColorPicker(e) {
    const type = e.currentTarget.dataset.type
    const color = type === 'dark' ? this.data.qrCodeStyle.colorDark : this.data.qrCodeStyle.colorLight
    
    wx.showModal({
      title: '设置颜色',
      content: '请输入十六进制颜色值（例如：#000000）',
      editable: true,
      placeholderText: color,
      success: (res) => {
        if (res.confirm) {
          const newColor = res.content
          // 验证颜色格式
          if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
            this.updateQRCodeStyle({
              [`color${type.charAt(0).toUpperCase() + type.slice(1)}`]: newColor
            })
          } else {
            wx.showToast({
              title: '颜色格式错误',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  // 处理大小变化
  handleSizeChange(e) {
    const size = e.detail.value
    this.updateQRCodeStyle({
      width: size,
      height: size
    })
  },

  // 处理文字长度限制变化
  handleTextLengthChange(e) {
    const value = parseInt(e.detail.value)
    if (value > 0) {
      this.updateConfig({
        maxTextLength: value
      })
    } else {
      wx.showToast({
        title: '请输入有效数值',
        icon: 'none'
      })
    }
  },

  // 处理图片大小限制变化
  handleImageSizeChange(e) {
    const value = parseInt(e.detail.value)
    if (value > 0) {
      this.updateConfig({
        maxImageSize: value
      })
    } else {
      wx.showToast({
        title: '请输入有效数值',
        icon: 'none'
      })
    }
  },

  // 更新二维码样式
  updateQRCodeStyle(style) {
    const newStyle = {
      ...this.data.qrCodeStyle,
      ...style
    }
    
    this.setData({
      qrCodeStyle: newStyle
    })

    // 更新全局配置
    app.globalData.config.qrCodeStyles.default = newStyle
  },

  // 更新配置
  updateConfig(config) {
    const newConfig = {
      ...this.data.config,
      ...config
    }
    
    this.setData({
      config: newConfig
    })

    // 更新全局配置
    Object.assign(app.globalData.config, config)
  }
}) 