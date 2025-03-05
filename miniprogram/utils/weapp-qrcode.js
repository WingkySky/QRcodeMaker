/**
 * weapp-qrcode
 * @description 在微信小程序中快速生成二维码
 */

// 引入QRCode生成库
const QRCode = require('./qrcode.js');
const ErrorCorrectLevel = require('./qrcodeErrorCorrectLevel.js');

// 默认参数
const defaultOptions = {
  width: 256,
  height: 256,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: ErrorCorrectLevel.H,
};

function drawQrcode(options) {
  options = Object.assign({}, defaultOptions, options);

  return new Promise((resolve, reject) => {
    try {
      // 创建canvas上下文
      const ctx = wx.createCanvasContext(options.canvasId);
      
      // 创建QRCode实例
      const qrcode = new QRCode({
        width: options.width,
        height: options.height,
        correctLevel: options.correctLevel,
      });

      // 设置二维码内容
      qrcode.makeCode(options.text);

      // 获取单元格大小
      const cells = qrcode.getCells();
      const cellSize = options.width / cells.length;

      // 绘制背景
      ctx.setFillStyle(options.colorLight);
      ctx.fillRect(0, 0, options.width, options.height);

      // 绘制数据单元格
      ctx.setFillStyle(options.colorDark);
      for (let row = 0; row < cells.length; row++) {
        for (let col = 0; col < cells.length; col++) {
          if (cells[row][col]) {
            ctx.fillRect(
              col * cellSize,
              row * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }

      // 绘制到canvas
      ctx.draw(false, () => {
        // 延迟获取图片，确保绘制完成
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: options.canvasId,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
          });
        }, 300);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  drawQrcode,
  ErrorCorrectLevel,
}; 