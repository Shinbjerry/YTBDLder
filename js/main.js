const USER_DATA_KEY = 'video_downloader_user';

function getCurrentUser() {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
}

function saveUser(user) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

function showLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

function hideLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function showRegisterModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('registerModal').style.display = 'flex';
}

function hideRegisterModal() {
  document.getElementById('registerModal').style.display = 'none';
}

function updateUserSection() {
  const user = getCurrentUser();
  const userSection = document.getElementById('userSection');
  
  if (user) {
    userSection.innerHTML = `
      <div class="user-info">
        <span>欢迎, ${user.username}</span>
        <button class="logout-btn" onclick="logout()">退出登录</button>
      </div>
    `;
    updateDownloadInfo();
  } else {
    userSection.innerHTML = `
      <button class="login-btn" onclick="showLoginModal()">登录</button>
    `;
  }
}

function updateDownloadInfo() {
  const user = getCurrentUser();
  if (!user) return;

  const remainingEl = document.getElementById('remainingDownloads');
  const expiryEl = document.getElementById('membershipExpiry');

  if (remainingEl) {
    if (user.membershipType === 'unlimited') {
      remainingEl.textContent = '无限下载';
    } else {
      remainingEl.textContent = `${user.downloadCount} 次`;
    }
  }

  if (expiryEl) {
    if (user.membershipExpiry) {
      expiryEl.textContent = user.membershipExpiry;
    } else {
      expiryEl.textContent = '普通用户';
    }
  }
}

function logout() {
  localStorage.removeItem(USER_DATA_KEY);
  updateUserSection();
  alert('已成功退出登录');
}

document.addEventListener('DOMContentLoaded', function() {
  updateUserSection();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username && password) {
        const mockUser = {
          username: username,
          email: 'test@example.com',
          downloadCount: 1,
          membershipType: 'free',
          membershipExpiry: null
        };
        saveUser(mockUser);
        updateUserSection();
        hideLoginModal();
        alert('登录成功！');
      } else {
        alert('请填写用户名和密码');
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('regUsername').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;

      if (username && email && password) {
        const newUser = {
          username: username,
          email: email,
          downloadCount: 1,
          membershipType: 'free',
          membershipExpiry: null
        };
        saveUser(newUser);
        updateUserSection();
        hideRegisterModal();
        alert('注册成功！');
      } else {
        alert('请填写所有字段');
      }
    });
  }

  const buyButtons = document.querySelectorAll('.buy-btn');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const plan = this.dataset.plan;
      buyPlan(plan);
    });
  });
});

function buyPlan(plan) {
  const user = getCurrentUser();
  if (!user) {
    alert('请先登录');
    showLoginModal();
    return;
  }

  const plans = {
    single: { name: '单次下载', price: 0.1, downloads: 1 },
    daily: { name: '包天无限', price: 5, downloads: -1, days: 1 },
    monthly: { name: '包月会员', price: 50, downloads: -1, days: 30 },
    quarterly: { name: '包季会员', price: 100, downloads: -1, days: 90 },
    yearly: { name: '包年会员', price: 500, downloads: -1, days: 365 }
  };

  const selectedPlan = plans[plan];
  if (!selectedPlan) return;

  if (confirm(`确认购买 ${selectedPlan.name} (¥${selectedPlan.price})？`)) {
    if (selectedPlan.downloads === -1) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + selectedPlan.days);
      user.membershipType = 'unlimited';
      user.membershipExpiry = expiryDate.toLocaleDateString('zh-CN');
      user.downloadCount = -1;
    } else {
      user.downloadCount += selectedPlan.downloads;
    }
    saveUser(user);
    updateDownloadInfo();
    alert(`购买成功！${selectedPlan.name}`);
  }
}

function isValidYouTubeUrl(url) {
  const youtubePatterns = [
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?youtu\.be\/[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/
  ];
  return youtubePatterns.some(pattern => pattern.test(url));
}

function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  return match ? match[1] : null;
}

function startDownload() {
  const user = getCurrentUser();
  if (!user) {
    alert('请先登录');
    showLoginModal();
    return;
  }

  const videoUrl = document.getElementById('videoUrl');
  if (!videoUrl || !videoUrl.value.trim()) {
    alert('请输入视频链接');
    return;
  }

  const url = videoUrl.value.trim();
  if (!isValidYouTubeUrl(url)) {
    alert('请输入有效的YouTube视频链接\n\n支持的格式：\n- https://www.youtube.com/watch?v=视频ID\n- https://youtu.be/视频ID\n- https://www.youtube.com/embed/视频ID');
    return;
  }

  if (user.membershipType !== 'unlimited' && user.downloadCount <= 0) {
    alert('下载次数不足，请充值');
    window.location.href = 'pricing.html';
    return;
  }

  const videoId = extractVideoId(url);

  const resolutionOptions = document.getElementById('resolutionOptions');
  const downloadStatus = document.getElementById('downloadStatus');
  const downloadResult = document.getElementById('downloadResult');

  resolutionOptions.style.display = 'none';
  downloadStatus.style.display = 'block';
  downloadResult.style.display = 'none';

  let progress = 0;
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      setTimeout(() => {
        downloadStatus.style.display = 'none';
        downloadResult.style.display = 'block';
        
        if (user.membershipType !== 'unlimited') {
          user.downloadCount--;
          saveUser(user);
          updateDownloadInfo();
        }

        document.getElementById('videoTitle').textContent = `video_${videoId}.mp4`;
      }, 500);
    }
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `正在处理... ${Math.round(progress)}%`;
  }, 300);
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

const saveBtn = document.getElementById('saveBtn');
if (saveBtn) {
  saveBtn.addEventListener('click', function() {
    const blob = new Blob(['示例视频内容'], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('下载完成！');
  });
}