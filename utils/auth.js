const request = require("request");
function login () {
  let promise = new Promise(function (resolve, reject) {
    wx.login({
      success: res => {
        request.get("/admin/getSessionKeyOropenid",
          { "code": res.code }
        ).then(res => {
          wx.setStorageSync("auth_token", res.data.tokenHead + res.data.token);
          resolve(res)
        })
      }
    })
  })
  return promise
}

module.exports = {
  "login": function () {
    return login();
  }
};