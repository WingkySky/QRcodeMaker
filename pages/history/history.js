// 获取应用实例
const app = getApp()

Page({
  data: {
    history: []
  },

  onShow() {
    this.loadHistory()
  },

  // 加载历史记录
  loadHistory() {
    const history = app.globalData.history.map(item => ({
      ...item,
      createTimeStr: this.formatTime(item.createTime)
    }))
    this.setData({ history })
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  // 预览二维码
  previewQRCode(e) {
    const path = e.currentTarget.dataset.path
    wx.previewImage({
      urls: [path]
    })
  },

  // 重新生成二维码
  regenerateQRCode(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.history[index]
    
    // 跳转到首页并传递参数
    wx.switchTab({
      url: '/pages/index/index',
      success: () => {
        // 通过全局变量传递数据
        app.globalData.regenerateData = {
          type: item.type,
          content: item.content
        }
      }
    })
  },

  // 删除历史记录
  deleteHistory(e) {
    const index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const history = app.globalData.history
          history.splice(index, 1)
          app.globalData.history = history
          wx.setStorageSync('qrcode_history', history)
          this.loadHistory()
        }
      }
    })
  },

  // 清空历史记录
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.history = []
          wx.setStorageSync('qrcode_history', [])
          this.setData({ history: [] })
        }
      }
    })
  }
}) 