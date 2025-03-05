const { drawQrcode, ErrorCorrectLevel } = require('../../utils/weapp-qrcode.js');

Page({
  data: {
    content: '',
    type: 'text',
    qrCodePath: '',
  },

  onLoad() {
    // 获取设备信息以适配不同屏幕
    const systemInfo = wx.getSystemInfoSync();
    const rpx = systemInfo.windowWidth / 750;
    // 增加一些边距，确保二维码完整显示
    this.qrcodeSize = Math.floor(350 * rpx);
  },

  onInputChange(e) {
    this.setData({
      content: e.detail.value
    });
  },

  onTypeChange(e) {
    this.setData({
      type: e.detail.value
    });
  },

  async generateQRCode() {
    const { content, type } = this.data;
    
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    // 根据不同类型处理内容
    let qrContent = content;
    if (type === 'url') {
      // 检查URL格式，避免重复添加http://
      if (!content.match(/^https?:\/\//i)) {
        qrContent = 'http://' + content;
      }
    }

    try {
      wx.showLoading({
        title: '生成中...',
        mask: true
      });

      // 清除之前的二维码
      this.setData({ qrCodePath: '' });

      // 生成新的二维码
      const qrCodePath = await drawQrcode({
        width: this.qrcodeSize,
        height: this.qrcodeSize,
        canvasId: 'qrcode',
        text: qrContent,
        correctLevel: ErrorCorrectLevel.H,
        colorDark: "#000000",
        colorLight: "#ffffff",
      });

      this.setData({ qrCodePath });
      wx.hideLoading();
    } catch (error) {
      console.error('生成二维码失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '生成二维码失败',
        icon: 'none'
      });
    }
  },

  previewQRCode() {
    if (this.data.qrCodePath) {
      wx.previewImage({
        urls: [this.data.qrCodePath]
      });
    }
  },

  saveQRCode() {
    if (!this.data.qrCodePath) return;
    
    // 请求保存图片权限
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        this.saveImageToAlbum();
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '需要您授权保存图片到相册',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.writePhotosAlbum']) {
                    this.saveImageToAlbum();
                  }
                }
              });
            }
          }
        });
      }
    });
  },

  saveImageToAlbum() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.qrCodePath,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    });
  }
}); 