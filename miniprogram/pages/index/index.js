// 获取应用实例
const app = getApp()

Page({
  data: {
    currentType: 'text', // 当前选择的类型：text/url/image
    inputContent: '', // 输入内容
    tempImagePath: '', // 临时图片路径
    qrCodePath: '', // 生成的二维码路径
    canGenerate: false, // 是否可以生成二维码
    config: {
      maxTextLength: 500
    }
  },

  onLoad() {
    this.setData({
      config: app.globalData.config
    })
  },

  // 切换类型
  switchType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type,
      inputContent: '',
      tempImagePath: '',
      qrCodePath: '',
      canGenerate: false
    })
  },

  // 处理输入
  handleInput(e) {
    const content = e.detail.value
    this.setData({
      inputContent: content,
      canGenerate: content.length > 0
    })
  },

  // 选择图片
  async chooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      
      const tempFilePath = res.tempFilePaths[0]
      const fileInfo = await wx.getFileInfo({
        filePath: tempFilePath
      })

      // 检查文件大小
      if (fileInfo.size > this.data.config.maxImageSize * 1024) {
        wx.showToast({
          title: '图片大小超出限制',
          icon: 'none'
        })
        return
      }

      this.setData({
        tempImagePath: tempFilePath,
        canGenerate: true
      })
    } catch (error) {
      wx.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  },

  // 移除图片
  removeImage() {
    this.setData({
      tempImagePath: '',
      canGenerate: false
    })
  },

  // 生成二维码
  async generateQRCode() {
    wx.showLoading({
      title: '生成中...'
    })

    try {
      let content = ''
      switch (this.data.currentType) {
        case 'text':
        case 'url':
          content = this.data.inputContent
          break
        case 'image':
          // 上传图片到云存储
          const cloudPath = `qrcode/images/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath,
            filePath: this.data.tempImagePath
          })
          content = uploadRes.fileID
          break
      }

      // 调用云函数生成二维码
      const res = await wx.cloud.callFunction({
        name: 'generateQRCode',
        data: {
          content,
          type: this.data.currentType
        }
      })

      // 保存历史记录
      this.saveHistory(content, res.result.fileID)

      this.setData({
        qrCodePath: res.result.fileID
      })
    } catch (error) {
      wx.showToast({
        title: '生成失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 保存二维码到相册
  async saveQRCode() {
    try {
      // 下载云存储图片
      const res = await wx.cloud.downloadFile({
        fileID: this.data.qrCodePath
      })

      // 保存到相册
      await wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })

      wx.showToast({
        title: '保存成功'
      })
    } catch (error) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  },

  // 保存历史记录
  async saveHistory(content, qrCodePath) {
    try {
      const db = wx.cloud.database()
      await db.collection('qrcode_history').add({
        data: {
          type: this.data.currentType,
          content,
          qrCodePath,
          createTime: db.serverDate()
        }
      })
    } catch (error) {
      console.error('保存历史记录失败：', error)
    }
  },

  onShareAppMessage() {
    return {
      title: '二维码生成器',
      path: '/pages/index/index',
      imageUrl: this.data.qrCodePath || ''
    }
  }
}) 