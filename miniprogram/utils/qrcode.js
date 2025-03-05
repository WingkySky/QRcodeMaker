/**
 * 二维码生成工具核心类
 */
class QRCode {
  constructor(options = {}) {
    this.options = Object.assign({
      width: 256,
      height: 256,
      correctLevel: 2, // H级别纠错
    }, options);

    this.cells = [];
    this._init();
  }

  _init() {
    // 初始化二维码矩阵
    const size = Math.floor(this.options.width / 8);
    for (let i = 0; i < size; i++) {
      this.cells[i] = [];
      for (let j = 0; j < size; j++) {
        this.cells[i][j] = false;
      }
    }
  }

  makeCode(text) {
    if (!text) return;
    
    // 简化版实现：将文本转换为二进制，然后填充矩阵
    const binary = this._textToBinary(text);
    this._fillMatrix(binary);
  }

  _textToBinary(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      binary += text.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binary;
  }

  _fillMatrix(binary) {
    const size = this.cells.length;
    let index = 0;

    // 添加固定的定位图案
    this._addFinderPattern(0, 0);
    this._addFinderPattern(0, size - 7);
    this._addFinderPattern(size - 7, 0);

    // 填充数据
    for (let i = 0; i < size && index < binary.length; i++) {
      for (let j = 0; j < size && index < binary.length; j++) {
        if (!this._isInFinderPattern(i, j, size)) {
          this.cells[i][j] = binary[index] === '1';
          index++;
        }
      }
    }
  }

  _addFinderPattern(row, col) {
    // 添加7x7的定位图案
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 || j === 0 || j === 6 || // 外框
          (i >= 2 && i <= 4 && j >= 2 && j <= 4) // 内部实心方块
        ) {
          this.cells[row + i][col + j] = true;
        }
      }
    }
  }

  _isInFinderPattern(i, j, size) {
    // 检查是否在定位图案范围内
    return (
      (i < 7 && j < 7) || // 左上
      (i < 7 && j >= size - 7) || // 右上
      (i >= size - 7 && j < 7) // 左下
    );
  }

  getCells() {
    return this.cells;
  }
}

module.exports = QRCode; 