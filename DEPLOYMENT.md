# YouTube视频下载工具 - 部署指南

## 一、网页部署

### 1. 部署方式选择

#### 方式一：静态托管（推荐）
- **GitHub Pages**：免费，适合静态网站
- **Vercel**：免费，支持自动部署
- **Netlify**：免费，功能强大
- **Cloudflare Pages**：免费，全球CDN加速

#### 方式二：虚拟主机
- 购买域名和主机（如阿里云、腾讯云、Bluehost等）
- 通过FTP上传文件到主机

### 2. GitHub Pages 部署步骤

1. 创建 GitHub 仓库
2. 将所有文件上传到仓库
3. 进入仓库设置 -> Pages
4. 选择 `main` 分支，`/root` 目录
5. 点击 "Save"，等待部署完成

### 3. Vercel 部署步骤

1. 登录 Vercel（https://vercel.com）
2. 导入 GitHub 仓库
3. 配置项目设置（默认即可）
4. 点击 "Deploy"

### 4. 文件结构

部署时需要上传以下文件：
```
├── index.html          # 首页
├── download.html       # 下载页面
├── pricing.html        # 充值页面
├── about.html          # 关于页面
├── css/
│   └── style.css       # 样式文件
└── js/
    └── main.js         # 功能脚本
```

---

## 二、本地下载工具集成

### 1. 工具架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端网页                              │
│  (HTML + CSS + JavaScript)                                │
└──────────────────────────┬────────────────────────────────┘
                           │ API调用
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      后端服务器                            │
│  (Node.js/Python/Go)                                       │
└──────────────────────────┬────────────────────────────────┘
                           │ 调用本地工具
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    YouTube下载工具                         │
│  (yt-dlp / youtube-dl / 自定义脚本)                       │
└─────────────────────────────────────────────────────────────┘
```

### 2. 后端API设计

#### 下载请求接口
```
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=xxx",
  "resolution": "1080p",
  "userId": "user123"
}
```

#### 返回响应
```json
{
  "success": true,
  "message": "下载成功",
  "videoUrl": "/downloads/video_xxx.mp4",
  "filename": "video_xxx.mp4"
}
```

#### 用户信息接口
```
GET /api/user/{userId}
```

#### 充值接口
```
POST /api/purchase
Content-Type: application/json

{
  "userId": "user123",
  "plan": "monthly",
  "paymentMethod": "alipay"
}
```

### 3. Node.js 后端示例

```javascript
const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/download', async (req, res) => {
  try {
    const { url, resolution, userId } = req.body;
    
    // 验证用户下载次数
    const user = await getUser(userId);
    if (!user || (user.membershipType !== 'unlimited' && user.downloadCount <= 0)) {
      return res.status(403).json({ success: false, message: '下载次数不足' });
    }
    
    // 验证YouTube链接
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ success: false, message: '无效的YouTube链接' });
    }
    
    // 获取视频信息
    const info = await ytdl.getInfo(url);
    const videoId = info.videoDetails.videoId;
    const title = info.videoDetails.title;
    
    // 设置输出路径
    const outputPath = `./public/downloads/video_${videoId}.mp4`;
    
    // 下载视频
    ytdl(url, { quality: resolution })
      .pipe(require('fs').createWriteStream(outputPath))
      .on('finish', () => {
        // 更新用户下载次数
        if (user.membershipType !== 'unlimited') {
          user.downloadCount--;
          saveUser(user);
        }
        
        res.json({
          success: true,
          message: '下载成功',
          videoUrl: `/downloads/video_${videoId}.mp4`,
          filename: `${title}.mp4`
        });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 4. 使用 yt-dlp（推荐）

安装 yt-dlp：
```bash
pip install yt-dlp
```

Python 示例：
```python
import yt_dlp

def download_video(url, resolution, output_path):
    ydl_opts = {
        'format': f'bestvideo[height<={resolution.split("p")[0]}]+bestaudio/best',
        'outtmpl': output_path,
        'quiet': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
```

---

## 三、充值收费实现

### 1. 支付方式集成

#### 支付宝支付
1. 注册支付宝开放平台（https://open.alipay.com）
2. 创建应用，获取 APPID
3. 集成支付宝 SDK

#### 微信支付
1. 注册微信商户平台（https://pay.weixin.qq.com）
2. 创建应用，获取 APPID 和商户号
3. 集成微信支付 SDK

#### 支付流程
```
用户选择套餐 → 前端发起支付请求 → 后端生成订单 → 调用支付API → 用户支付 → 支付成功回调 → 更新用户权限
```

### 2. 数据库设计

#### 用户表 (users)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR | 用户ID |
| username | VARCHAR | 用户名 |
| email | VARCHAR | 邮箱 |
| password | VARCHAR | 加密密码 |
| downloadCount | INT | 剩余下载次数 |
| membershipType | VARCHAR | 会员类型 |
| membershipExpiry | DATETIME | 会员到期时间 |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

#### 订单表 (orders)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR | 订单ID |
| userId | VARCHAR | 用户ID |
| plan | VARCHAR | 套餐类型 |
| amount | DECIMAL | 金额 |
| status | VARCHAR | 订单状态 |
| paymentMethod | VARCHAR | 支付方式 |
| transactionId | VARCHAR | 交易ID |
| createdAt | DATETIME | 创建时间 |

### 3. 充值逻辑

```javascript
async function handlePurchase(userId, plan) {
  const plans = {
    single: { price: 0.1, downloads: 1 },
    daily: { price: 5, downloads: -1, days: 1 },
    monthly: { price: 50, downloads: -1, days: 30 },
    quarterly: { price: 100, downloads: -1, days: 90 },
    yearly: { price: 500, downloads: -1, days: 365 }
  };
  
  const selectedPlan = plans[plan];
  if (!selectedPlan) throw new Error('无效的套餐');
  
  // 创建订单
  const order = await createOrder(userId, plan, selectedPlan.price);
  
  // 调用支付接口（支付宝/微信）
  const paymentResult = await createPayment(order.id, selectedPlan.price);
  
  if (paymentResult.success) {
    // 更新订单状态
    await updateOrderStatus(order.id, 'paid');
    
    // 更新用户权限
    const user = await getUser(userId);
    
    if (selectedPlan.downloads === -1) {
      // 无限下载套餐
      user.membershipType = 'unlimited';
      user.membershipExpiry = new Date(Date.now() + selectedPlan.days * 24 * 60 * 60 * 1000);
      user.downloadCount = -1;
    } else {
      // 单次下载套餐
      user.downloadCount += selectedPlan.downloads;
    }
    
    await saveUser(user);
    
    return { success: true, message: '充值成功' };
  } else {
    throw new Error('支付失败');
  }
}
```

---

## 四、安全注意事项

### 1. 用户认证
- 使用 JWT Token 进行身份验证
- 密码使用 bcrypt 加密存储
- 设置合理的 Token 过期时间

### 2. 请求限制
- 实现 Rate Limiting 防止恶意请求
- 对下载接口进行频率限制
- 使用 CAPTCHA 防止自动化攻击

### 3. 文件安全
- 限制下载文件大小
- 验证文件类型
- 使用 CDN 加速文件下载

### 4. 支付安全
- 使用 HTTPS 加密传输
- 验证支付回调签名
- 记录所有支付日志

---

## 五、部署检查清单

- [ ] 配置域名和 HTTPS
- [ ] 设置数据库连接
- [ ] 配置支付接口
- [ ] 实现用户认证
- [ ] 添加日志记录
- [ ] 设置错误监控
- [ ] 配置 CDN
- [ ] 编写 API 文档
- [ ] 测试下载功能
- [ ] 测试充值功能

---

## 六、环境变量配置

创建 `.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=video_downloader
DB_USER=root
DB_PASSWORD=password

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 支付配置
ALIPAY_APPID=your_alipay_appid
ALIPAY_PRIVATE_KEY=your_alipay_private_key
WECHAT_APPID=your_wechat_appid
WECHAT_MCH_ID=your_wechat_mch_id
WECHAT_API_KEY=your_wechat_api_key

# 服务器配置
PORT=3000
NODE_ENV=production
```
