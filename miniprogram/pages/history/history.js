const app = getApp()

Page({
  data: {
    historyList: []
  },

  onLoad() {
    this.loadHistoryList()
  },

  onShow() {
    this.loadHistoryList()
  },

  // 加载历史记录
  async loadHistoryList() {
    try {
      const db = wx.cloud.database()
      const res = await db.collection('qrcode_history')
        .orderBy('createTime', 'desc')
        .get()

      // 格式化时间
      const list = res.data.map(item => ({
        ...item,
        createTime: this.formatTime(item.createTime)
      }))

      this.setData({
        historyList: list
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 预览二维码
  previewQRCode(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url]
    })
  },

  // 重新生成二维码
  regenerateQRCode(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/index/index?type=${item.type}&content=${encodeURIComponent(item.content)}`
    })
  },

  // 删除历史记录
  async deleteHistory(e) {
    const id = e.currentTarget.dataset.id
    try {
      const db = wx.cloud.database()
      await db.collection('qrcode_history').doc(id).remove()
      
      // 更新列表
      this.loadHistoryList()
      
      wx.showToast({
        title: '删除成功'
      })
    } catch (error) {
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  },

  // 清空历史记录
  async clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空所有历史记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const db = wx.cloud.database()
            // 由于小程序端无法直接删除整个集合，需要遍历删除
            const tasks = this.data.historyList.map(item => 
              db.collection('qrcode_history').doc(item._id).remove()
            )
            await Promise.all(tasks)
            
            this.setData({
              historyList: []
            })
            
            wx.showToast({
              title: '清空成功'
            })
          } catch (error) {
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  // 格式化时间
  formatTime(date) {
    date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${year}/${month}/${day} ${hour}:${minute}`
  }
}) 