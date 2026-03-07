# Frontend Service (React Version)

完整的 React 前端服务，包含所有必需的文件。
Complete React frontend service with all required files.

## 文件结构 / File Structure

```
frontend-service/
├── public/
│   └── index.html          # HTML 模板
├── src/
│   ├── index.js           # React 入口
│   ├── index.css          # 全局样式
│   ├── App.js             # 主组件
│   └── App.css            # 应用样式
├── package.json           # Node.js 依赖
└── requirements.txt       # Python 依赖
```

## 安装步骤 / Installation Steps

### 1. 替换文件
将这些文件复制到您的 `frontend-service` 目录：
Copy these files to your `frontend-service` directory:

```bash
cp -r public /path/to/your/frontend-service/
cp -r src /path/to/your/frontend-service/
```

### 2. 安装依赖
Install dependencies:

```bash
# Node.js 依赖
npm install

# Python 依赖
pip3 install -r requirements.txt
```

### 3. 启动服务
Start services:

#### 方式 A - 开发模式（推荐用于开发）
Development mode (recommended for development):

```bash
# 终端 1 - React 开发服务器
npm start

# 终端 2 - Flask 后端（如果需要）
python3 server/app.py
```

访问 / Visit: http://localhost:3000



## 快速修复当前问题 / Quick Fix for Current Issue

如果您已经在 `ecommerce-demo/frontend-service` 目录：
If you're already in `ecommerce-demo/frontend-service` directory:

```bash
# 创建缺失的目录和文件
mkdir -p public src

# 复制这个包中的文件
cp -r /path/to/this/package/public/* public/
cp -r /path/to/this/package/src/* src/

# 重新安装依赖
npm install

# 启动
npm start
```

## 环境变量 / Environment Variables

创建 `.env` 文件（可选）：
Create `.env` file (optional):

```
REACT_APP_PRODUCT_API=http://localhost:5001
REACT_APP_ORDER_API=http://localhost:5002
```

## 故障排除 / Troubleshooting

### 问题: "Could not find a required file"
解决方案: 确保 `public/index.html` 和 `src/index.js` 存在
Solution: Make sure `public/index.html` and `src/index.js` exist

### 问题: npm install 失败
解决方案: 删除 node_modules 和 package-lock.json 后重试
Solution: Delete node_modules and package-lock.json, then retry

```bash
rm -rf node_modules package-lock.json
npm install
```

### 问题: 端口 3000 被占用
解决方案: 使用不同的端口
Solution: Use a different port

```bash
PORT=3001 npm start
```
