// 引入二维码生成库
import QRCode from './weapp-qrcode.js'

/**
 * 生成二维码
 * @param {string} content - 要生成二维码的内容
 * @param {object} style - 二维码样式配置
 * @returns {Promise<string>} - 返回生成的二维码图片临时路径
 */
export function generateQRCode(content, style = {}) {
  return new Promise((resolve, reject) => {
    try {
      // 创建 canvas context
      const ctx = wx.createCanvasContext('qrcode')
      
      // 创建二维码实例
      new QRCode('qrcode', {
        text: content,
        width: style.size || 300,
        height: style.size || 300,
        colorDark: style.foreground || '#000000',
        colorLight: style.background || '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
        margin: style.margin || 10
      })

      // 将 canvas 转换为图片
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'qrcode',
          success: (res) => {
            resolve(res.tempFilePath)
          },
          fail: (error) => {
            reject(error)
          }
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 验证URL格式
 * @param {string} url - 要验证的URL
 * @returns {boolean} - 返回验证结果
 */
export function isValidUrl(url) {
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
  return pattern.test(url)
}

/**
 * 验证图片大小
 * @param {string} filePath - 图片文件路径
 * @param {number} maxSize - 最大允许大小（MB）
 * @returns {Promise<boolean>} - 返回验证结果
 */
export function checkImageSize(filePath, maxSize = 2) {
  return new Promise((resolve, reject) => {
    wx.getFileInfo({
      filePath,
      success: (res) => {
        const sizeInMB = res.size / (1024 * 1024)
        resolve(sizeInMB <= maxSize)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
} 