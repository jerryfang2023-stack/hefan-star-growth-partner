const DEFAULT_BASE_URL = 'http://127.0.0.1:3001';

function getBaseUrl() {
  return wx.getStorageSync('apiBaseUrl') || DEFAULT_BASE_URL;
}

function request(path, options = {}) {
  const role = options.role || 'child';

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${getBaseUrl()}${path}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'x-role': role,
        'x-child-id': 'demo-child',
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }

        reject(new Error(res.data?.detail || '请求失败，请稍后再试。'));
      },
      fail() {
        reject(new Error('连接不到后端服务，请检查后端地址。'));
      },
    });
  });
}

module.exports = {
  getBaseUrl,
  request,
};
