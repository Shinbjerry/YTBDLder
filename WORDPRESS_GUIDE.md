# 使用WordPress自建视频下载工具网页指南

## 一、WordPress安装准备

### 1. 服务器环境要求

| 组件 | 最低版本 | 推荐版本 |
|------|----------|----------|
| PHP | 7.4 | 8.0+ |
| MySQL | 5.6 | 8.0+ |
| Apache | 2.4 | 2.4+ |
| Nginx | 1.16 | 1.20+ |

### 2. 主机选择

#### 推荐方案
- **阿里云ECS**：稳定可靠，适合生产环境
- **腾讯云CVM**：性价比高，国内访问速度快
- **Bluehost**：国际知名主机商，适合海外用户
- **SiteGround**：专业WordPress主机，优化配置

#### 一键安装方案
- 宝塔面板（国内）：一键安装WordPress
- cPanel（国际）：Softaculous一键安装

---

## 二、WordPress安装步骤

### 1. 宝塔面板安装（推荐国内用户）

1. **购买服务器**：阿里云/腾讯云购买ECS服务器
2. **安装宝塔面板**：
   ```bash
   yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
   ```
3. **登录宝塔**：访问 http://服务器IP:8888
4. **一键安装WordPress**：
   - 左侧菜单 → 软件商店 → 一键部署
   - 选择WordPress → 填写域名和数据库信息 → 点击提交

### 2. 手动安装

1. **下载WordPress**：https://wordpress.org/download/
2. **上传文件**：通过FTP上传到网站根目录
3. **创建数据库**：在MySQL中创建数据库和用户
4. **配置wp-config.php**：
   ```php
   define( 'DB_NAME', 'your_database_name' );
   define( 'DB_USER', 'your_username' );
   define( 'DB_PASSWORD', 'your_password' );
   define( 'DB_HOST', 'localhost' );
   ```
5. **访问安装页面**：http://yourdomain.com/wp-admin/install.php

---

## 三、主题选择与安装

### 1. 推荐主题

#### 免费主题
- **Astra**：轻量、快速、高度可定制
- **GeneratePress**：简洁现代，适合工具类网站
- **Neve**：响应式设计，良好的移动端体验

#### 付费主题
- **Avada**：功能强大，适合复杂网站
- **Divi**：可视化编辑器，适合DIY设计
- **Flatsome**：电商友好，也适合工具类网站

### 2. 主题安装

1. 登录WordPress后台 → 外观 → 主题 → 添加新主题
2. 搜索主题名称 → 安装 → 启用

---

## 四、页面创建

### 1. 创建页面结构

| 页面名称 | 用途 | 模板 |
|----------|------|------|
| 首页 | 网站介绍和入口 | 首页模板 |
| 下载工具 | 视频下载表单 | 自定义页面 |
| 充值套餐 | 会员套餐展示 | 自定义页面 |
| 关于我们 | 网站介绍和联系方式 | 关于页面 |
| 隐私政策 | 隐私声明 | 普通页面 |

### 2. 使用自定义HTML块

WordPress 5.0+支持区块编辑器，可以使用"自定义HTML"块添加HTML代码：

1. 创建新页面 → 添加区块 → 搜索"自定义HTML"
2. 将现有HTML代码粘贴到区块中
3. 添加样式（推荐使用CSS插件或主题自定义CSS）

---

## 五、功能实现

### 1. 用户登录系统

#### 方案一：使用插件
- **WP-Members**：简单的会员管理插件
- **MemberPress**：功能强大的会员系统（付费）
- **Ultimate Member**：完整的用户管理系统

#### 方案二：使用WordPress内置功能
- WordPress自带用户注册/登录功能
- 使用短代码 `[wp_login_form]` 添加登录表单
- 使用插件自定义登录页面样式

### 2. 下载功能集成

#### 方案一：使用iframe嵌入
```html
<iframe src="download-tool.html" width="100%" height="600px" frameborder="0"></iframe>
```

#### 方案二：使用自定义插件
1. 创建自定义插件目录 `wp-content/plugins/video-downloader`
2. 创建主文件 `video-downloader.php`：

```php
<?php
/**
 * Plugin Name: YouTube视频下载器
 * Description: 集成YouTube视频下载功能
 * Version: 1.0
 * Author: Your Name
 */

function video_downloader_shortcode() {
    ob_start();
    ?>
    <div class="download-container">
        <!-- 下载表单HTML代码 -->
        <input type="text" id="videoUrl" placeholder="请输入YouTube视频链接">
        <button onclick="startDownload()">开始下载</button>
    </div>
    <script>
        // JavaScript下载逻辑
        function startDownload() {
            // 下载逻辑代码
        }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('video_downloader', 'video_downloader_shortcode');
?>
```

3. 在页面中使用短代码 `[video_downloader]`

### 3. 充值收费系统

#### 方案一：使用电商插件
- **WooCommerce**：强大的电商插件，支持多种支付方式
- **Easy Digital Downloads**：专注数字产品销售

#### 方案二：集成支付接口
1. **支付宝支付**：使用插件 `Alipay for WooCommerce`
2. **微信支付**：使用插件 `WeChat Pay for WooCommerce`

#### 套餐设置示例

在WooCommerce中创建产品：

| 产品名称 | 价格 | 描述 |
|----------|------|------|
| 单次下载 | ¥0.10 | 单次视频下载权限 |
| 包天会员 | ¥5.00 | 24小时无限下载 |
| 包月会员 | ¥50.00 | 30天无限下载 |
| 包季会员 | ¥100.00 | 90天无限下载 |
| 包年会员 | ¥500.00 | 365天无限下载 |

---

## 六、样式自定义

### 1. 添加自定义CSS

1. 外观 → 自定义 → 额外CSS
2. 添加样式代码：

```css
/* 下载容器样式 */
.download-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

/* 输入框样式 */
#videoUrl {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 15px;
    box-sizing: border-box;
}

/* 按钮样式 */
.download-container button {
    width: 100%;
    padding: 15px;
    background: #fff;
    color: #667eea;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.download-container button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}
```

### 2. 使用页面构建器插件

- **Elementor**：可视化页面构建器（推荐）
- **Beaver Builder**：拖拽式页面设计
- **Visual Composer**：强大的页面编辑工具

---

## 七、安全配置

### 1. 基础安全设置

1. **修改默认用户名**：避免使用"admin"作为管理员用户名
2. **强密码策略**：使用复杂密码（字母+数字+特殊字符）
3. **限制登录尝试**：安装插件 `Limit Login Attempts Reloaded`
4. **启用SSL**：安装SSL证书（Let's Encrypt免费证书）

### 2. 插件安全

| 插件名称 | 功能 |
|----------|------|
| Wordfence Security | 防火墙和恶意软件扫描 |
| Sucuri Security | 安全监控和防护 |
| UpdraftPlus | 网站备份 |

---

## 八、性能优化

### 1. 缓存插件

- **WP Rocket**：功能全面的缓存插件（付费）
- **WP Super Cache**：免费缓存插件
- **WP Fastest Cache**：简单易用的缓存插件

### 2. 图片优化

- **Smush**：图片压缩插件
- **EWWW Image Optimizer**：自动图片优化

### 3. CDN加速

- **Cloudflare**：免费CDN服务
- **阿里云CDN**：国内加速服务

---

## 九、部署检查清单

- [ ] 安装WordPress并完成基本配置
- [ ] 选择并安装合适的主题
- [ ] 创建必要的页面（首页、下载工具、充值套餐、关于我们）
- [ ] 集成用户登录系统
- [ ] 实现下载功能（iframe或自定义插件）
- [ ] 配置支付接口（支付宝/微信支付）
- [ ] 添加自定义样式
- [ ] 配置SSL证书
- [ ] 安装安全插件
- [ ] 设置缓存和CDN
- [ ] 测试所有功能

---

## 十、常见问题

### 1. WordPress后台登录不了？
- 检查用户名和密码是否正确
- 检查数据库连接配置
- 通过FTP修改 `wp-config.php` 启用调试模式

### 2. 页面样式显示异常？
- 检查主题是否正确安装
- 清除浏览器缓存
- 检查自定义CSS是否有语法错误

### 3. 下载功能无法使用？
- 检查JavaScript代码是否正确
- 检查服务器PHP版本是否支持
- 检查服务器是否有防火墙限制

---

## 十一、参考资源

- WordPress官方文档：https://wordpress.org/support/
- WordPress中文论坛：https://wordpress.org/support/forum/chinese/
- 宝塔面板教程：https://www.bt.cn/bbs/
- WooCommerce文档：https://woocommerce.com/documentation/
