// 获取应用实例
const app = getApp()
import { generateQRCode } from '../../utils/qrcode.js'

Page({
  data: {
    currentType: 'text', // 当前选择的类型：text/url/image
    inputContent: '', // 输入内容
    tempImagePath: '', // 临时图片路径
    qrcodePath: '', // 生成的二维码路径
  },

  // 切换类型
  switchType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type,
      inputContent: '',
      tempImagePath: '',
      qrcodePath: ''
    })
  },

  // 处理输入
  handleInput(e) {
    this.setData({
      inputContent: e.detail.value
    })
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempImagePath: res.tempFilePaths[0]
        })
      }
    })
  },

  // 移除图片
  removeImage() {
    this.setData({
      tempImagePath: ''
    })
  },

  // 生成二维码
  async generateQRCode() {
    let content = ''
    
    // 验证输入
    if (this.data.currentType === 'text' || this.data.currentType === 'url') {
      content = this.data.inputContent
      if (!content) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return
      }
      
      // URL格式验证
      if (this.data.currentType === 'url') {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
        if (!urlPattern.test(content)) {
          wx.showToast({
            title: '请输入有效的网址',
            icon: 'none'
          })
          return
        }
      }
    } else if (this.data.currentType === 'image') {
      if (!this.data.tempImagePath) {
        wx.showToast({
          title: '请选择图片',
          icon: 'none'
        })
        return
      }
      content = this.data.tempImagePath
    }

    wx.showLoading({
      title: '生成中...'
    })

    try {
      // 生成二维码
      const qrcodePath = await generateQRCode(content, app.globalData.qrcodeStyle)
      
      this.setData({
        qrcodePath
      })

      // 保存到历史记录
      const history = app.globalData.history
      history.unshift({
        type: this.data.currentType,
        content,
        qrcodePath,
        createTime: new Date().getTime()
      })
      app.globalData.history = history.slice(0, 50) // 只保留最近50条记录
      wx.setStorageSync('qrcode_history', app.globalData.history)

    } catch (error) {
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      })
    }

    wx.hideLoading()
  },

  // 保存二维码到相册
  saveQRCode() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.qrcodePath,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail: () => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '二维码生成器',
      path: '/pages/index/index',
      imageUrl: this.data.qrcodePath
    }
  }
}) 