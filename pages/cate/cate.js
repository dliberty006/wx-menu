// pages/cate/cate.js
const request = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex:0,
    cateOne:[],
    cateTwo:[],
    cateThree:[],
    oneName:'',
    height:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    this.getOne();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapOne:function(e) {
    let index = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.name
    this.setData({
      selectIndex: index,
      oneName:name
    })
    this.getTwo(index)
  },
  getOne:function(){
    request.get("/menu/cate/view/-1").then(res => {
      this.setData({
        cateOne: res.data.cates,
        selectIndex:res.data.cates[0].id,
        oneName:res.data.cates[0].categoryName
      })
      this.getTwo(res.data.cates[0].id);
    })
  },
  getTwo:function(parentId) {
    if (!parentId) {
      return;
    }
    request.get("/menu/cate/view/"+parentId).then(res => {
      this.setData({
        cateTwo: res.data.cates
      })
    })
  },
  tapItem:function(e){
    let cateId = e.currentTarget.dataset.cateid;
    let cateName = e.currentTarget.dataset.catename;
    wx.navigateTo({
      url: '/pages/qrlist/qrlist?cateId=' + cateId + "&cateName=" + cateName
      
    })
  },
  clickInput: function () {
    wx.navigateTo({
      url: '/pages/qrlist/qrlist?type=1',
    })
  }

})