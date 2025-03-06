const fs = require('fs');
const path = require('path');

// 创建一个32x32的PNG图标
function createIcon(color) {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // 绘制图标
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas.toDataURL('image/png');
}

// 生成并保存图标
function generateIcons() {
  const icons = {
    'home': '#999999',
    'home-active': '#1296db',
    'history': '#999999',
    'history-active': '#1296db',
    'settings': '#999999',
    'settings-active': '#1296db'
  };
  
  const targetDir = path.join(__dirname, '../assets/icons/tabbar');
  
  // 确保目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // 生成每个图标
  Object.entries(icons).forEach(([name, color]) => {
    const iconData = createIcon(color);
    const base64Data = iconData.replace(/^data:image\/png;base64,/, '');
    
    fs.writeFileSync(
      path.join(targetDir, `${name}.png`),
      Buffer.from(base64Data, 'base64')
    );
  });
}

generateIcons(); 