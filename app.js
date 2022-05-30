//app.js
App({
  onLaunch: function () {

    // 展示本地存储能力
    var auth_token = wx.getStorageSync('auth_token') || ''
    const auth = require("/utils/auth");
    const request = require("/utils/request");
    // 登录
    if (!auth_token) {
      auth.login();
    }
    
    
  }
})