const apiHttp = "https://www.dliberty.com/cms";

function fun(url, method, data, header, resolve2) {
  data = data || {};
  header = header || {};
  let token = wx.getStorageSync("auth_token");
  if (token) {
    if (!header || !header["Authorization"]) {
      header["Authorization"] = token;
    }
  }
  wx.showNavigationBarLoading();
  
  let promise = new Promise(function (resolve, reject) {
    if (!resolve2) {
      resolve2 = resolve
    }
    wx.request({
      url: apiHttp + url,
      header: header,
      data: data,
      method: method,
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showToast({
            title: "操作失败",
            icon: "none"
          });
          reject("操作失败");
        } else if (res.statusCode == 200 && res.data.code == '0') {
          resolve2(res);
        } else if (res.data.code == '2') {
          //登陆信息失效
          wx.login({
            success: res => {
              wx.request({
                url: apiHttp + '/admin/getSessionKeyOropenid',
                data: {"code":res.code},
                method: 'GET',
                dataType: 'json',
                success: function(res) {
                  if (res.data.code == '0') {
                  wx.setStorageSync("auth_token", res.data.tokenHead + res.data.token);
                  fun(url, method, data,null, resolve2);
                  }
                },
                fail: function(res) {},
                complete: function(res) {},
              })
              
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          });
          reject(res.data.message);
        }
        
      },
      fail: reject,
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
}

module.exports = {
  apiHttp: apiHttp,
  "get": function (url, data, header) {
    return fun(url, "GET", data, header);
  },
  "post": function (url, data, header) {
    return fun(url, "POST", data, header);
  }
};
