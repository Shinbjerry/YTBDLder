# InfinityFree WordPress 安装指南

## 准备工作

在开始之前，请准备好：
- 📧 一个邮箱地址（用于注册）
- 🌐 一个域名（可选，也可以使用免费子域名）

---

## 第一步：注册 InfinityFree 账户

### 1. 访问官网
打开浏览器，访问 InfinityFree 官网：
```
https://www.infinityfree.net
```

### 2. 注册账户
1. 点击右上角 **"Sign Up"** 按钮
2. 填写注册信息：
   - **Username**：输入您的用户名
   - **Email**：输入您的邮箱地址（如 shinbjerry@gmail.com）
   - **Password**：设置密码
3. 勾选同意服务条款
4. 点击 **"Create Account"**

### 3. 验证邮箱
1. 登录您的邮箱
2. 找到 InfinityFree 发送的验证邮件
3. 点击邮件中的验证链接完成注册

---

## 第二步：创建网站

### 1. 登录账户
访问 https://www.infinityfree.net/panel 登录您的账户

### 2. 创建新网站
1. 在面板中找到 **"Add Website"** 或 **"Create New Account"**
2. 填写网站信息：
   - **Domain**：输入域名（可以是免费子域名，如 `yourname.epizy.com`）
   - **Password**：设置 FTP 密码（用于文件管理）
3. 点击 **"Create"**

### 3. 等待创建完成
系统会自动创建网站空间，大约需要 1-2 分钟

---

## 第三步：安装 WordPress

### 方法一：使用 Softaculous 一键安装（推荐）

1. 在控制面板中找到 **"Softaculous Apps Installer"**
2. 在搜索框中输入 **"WordPress"**
3. 点击 WordPress 图标进入安装页面
4. 点击 **"Install Now"**

#### 安装设置：
| 设置项 | 说明 | 建议值 |
|--------|------|--------|
| Choose Domain | 选择要安装的域名 | 您的域名 |
| Directory | 安装目录 | 留空（安装到根目录） |
| Site Name | 网站名称 | 如 "YouTube视频下载工具" |
| Site Description | 网站描述 | 简短描述您的网站 |
| Admin Username | 管理员用户名 | 不要使用 "admin" |
| Admin Password | 管理员密码 | 设置强密码 |
| Admin Email | 管理员邮箱 | 您的邮箱 |

5. 点击 **"Install"** 完成安装

### 方法二：手动安装（备用）

#### 1. 下载 WordPress
访问 https://wordpress.org/download/ 下载最新版本

#### 2. 上传文件
1. 在控制面板中找到 **"File Manager"**
2. 进入 `public_html` 目录
3. 点击 **"Upload"** 上传 WordPress 压缩包
4. 解压文件到当前目录

#### 3. 创建数据库
1. 在控制面板中找到 **"MySQL Databases"**
2. 创建新数据库：
   - Database Name：输入数据库名称
   - Database Username：输入用户名
   - Database Password：设置密码
3. 点击 **"Create Database"**

#### 4. 配置 WordPress
1. 访问您的域名（如 http://yourname.epizy.com）
2. 选择语言后点击 **"Continue"**
3. 点击 **"Let's go!"**
4. 填写数据库信息：
   - Database Name：您创建的数据库名
   - Username：数据库用户名
   - Password：数据库密码
   - Database Host：`localhost`
5. 点击 **"Submit"**
6. 点击 **"Run the installation"**
7. 填写网站信息：
   - Site Title：网站名称
   - Username：管理员用户名
   - Password：管理员密码
   - Your Email：管理员邮箱
8. 点击 **"Install WordPress"**

---

## 第四步：登录 WordPress 后台

安装完成后，访问以下地址登录后台：
```
http://yourdomain.com/wp-admin
```

输入您设置的管理员用户名和密码，点击 **"Log In"**

---

## 第五步：基本配置

### 1. 固定链接设置
1. 进入 **设置 > 固定链接**
2. 选择 **"文章名"** 或 **"自定义结构"**
3. 点击 **"保存更改"**

### 2. 更新插件和主题
1. 进入 **仪表盘 > 更新**
2. 更新所有可用的插件和主题

### 3. 安装必要插件
推荐安装以下插件：
- **Yoast SEO**：SEO优化
- **WP Super Cache**：缓存优化
- **Wordfence Security**：安全防护
- **UpdraftPlus**：网站备份

---

## 第六步：导入视频下载工具页面

### 方法一：使用自定义HTML块

1. 在 WordPress 后台进入 **页面 > 添加新页面**
2. 点击编辑器右上角的三个点，选择 **"代码编辑器"**
3. 将 `download.html` 的内容粘贴进去
4. 点击 **"发布"**

### 方法二：创建自定义插件

1. 在 `wp-content/plugins/` 目录下创建 `video-downloader` 文件夹
2. 创建 `video-downloader.php` 文件：

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
        <h3>YouTube视频下载工具</h3>
        <p>请输入YouTube视频链接：</p>
        <input type="text" id="videoUrl" placeholder="https://www.youtube.com/watch?v=..." />
        <select id="resolutionOptions">
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
            <option value="360p">360p</option>
        </select>
        <button onclick="startDownload()">开始下载</button>
        <div id="downloadStatus"></div>
        <div id="downloadResult"></div>
    </div>
    <style>
        .download-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            color: white;
        }
        #videoUrl, #resolutionOptions, button {
            display: block;
            width: 100%;
            padding: 15px;
            margin: 10px 0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
        }
        button {
            background: white;
            color: #667eea;
            font-weight: 600;
            cursor: pointer;
        }
    </style>
    <script>
        function startDownload() {
            const url = document.getElementById('videoUrl').value;
            const resolution = document.getElementById('resolutionOptions').value;
            
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                alert('请输入有效的YouTube链接');
                return;
            }
            
            document.getElementById('downloadStatus').innerHTML = '正在处理...';
        }
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('video_downloader', 'video_downloader_shortcode');
?>
```

3. 在 WordPress 后台进入 **插件 > 已安装插件**
4. 找到 "YouTube视频下载器" 并激活
5. 在页面中使用短代码 `[video_downloader]`

---

## 第七步：配置充值收费系统

### 使用 WooCommerce 插件

1. 在 WordPress 后台进入 **插件 > 添加新插件**
2. 搜索 **"WooCommerce"** 并安装激活
3. 按向导完成基本配置
4. 创建产品：
   - 产品名称：单次下载
   - 价格：¥0.10
   - 产品类型：虚拟产品

### 安装支付插件

1. 安装 **"Alipay for WooCommerce"** 或 **"WeChat Pay for WooCommerce"**
2. 配置支付接口信息

---

## 常见问题

### 1. 网站无法访问？
- 检查域名是否正确解析
- 等待 DNS 生效（可能需要几分钟到几小时）
- 检查 `.htaccess` 文件是否正确

### 2. WordPress 后台登录不了？
- 检查用户名和密码
- 通过 FTP 修改 `wp-config.php` 启用调试模式
- 清除浏览器缓存

### 3. 页面样式显示异常？
- 清除 WordPress 缓存
- 检查主题是否正确安装
- 检查自定义CSS是否有语法错误

### 4. 数据库连接失败？
- 检查数据库配置信息是否正确
- 确保数据库用户名和密码正确
- 确认数据库已创建

---

## 重要提示

### 备份
定期备份您的网站数据：
1. 使用 UpdraftPlus 插件备份
2. 导出数据库
3. 下载网站文件到本地

### 安全
- 使用强密码
- 定期更新 WordPress、主题和插件
- 安装安全插件如 Wordfence
- 启用 SSL（在 InfinityFree 控制面板中申请）

### 优化
- 安装缓存插件提升速度
- 压缩图片
- 使用 CDN（可使用 Cloudflare）

---

## 参考资源

- InfinityFree 帮助文档：https://infinityfree.net/support
- WordPress 官方文档：https://wordpress.org/support/
- WooCommerce 文档：https://woocommerce.com/documentation/

---

## 下一步

安装完成后，您可以：
1. 🎨 选择并安装一个漂亮的主题
2. 📝 创建页面和文章
3. 🔌 安装必要的插件
4. 💰 配置支付系统
5. 🚀 发布您的网站！

如果您遇到任何问题，随时可以参考上面的常见问题或联系 InfinityFree 客服！
