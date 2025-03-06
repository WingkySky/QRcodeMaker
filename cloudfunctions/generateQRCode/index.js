const cloud = require('wx-server-sdk')
const QRCode = require('qrcode')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { content, type } = event

  try {
    // 生成二维码
    const qrCodeBuffer = await QRCode.toBuffer(content, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })

    // 上传到云存储
    const cloudPath = `qrcode/generated/${Date.now()}-${Math.random().toString(36).substr(2)}.jpg`
    const uploadResult = await cloud.uploadFile({
      cloudPath,
      fileContent: qrCodeBuffer
    })

    return {
      success: true,
      fileID: uploadResult.fileID
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
} 