// pages/index/index.js
const request = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bnrUrl: [],
    tjList:[],
    topicList:[],
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.menuId) {
      wx.navigateTo({
        url: '/pages/detail/detail?menuId=' + options.menuId,
      })
    } 
    this.loadBanner();
    this.loadTjList();
    this.loadTopicList();
    this.loadTuijian();
    
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
  clickInput:function(){
    wx.navigateTo({
      url: '/pages/qrlist/qrlist?type=1',
    })
  },
  goDetail: function (e) {
    let menuid = e.currentTarget.dataset.menuid
    wx.navigateTo({
      url: '/pages/detail/detail?menuId=' + menuid,
    })
  },
  loadBanner:function(){
    request.get("/banner/list/1").then(res => {
      if (res.data.list.length != 0) {
        this.setData({
          bnrUrl: res.data.list
        })
      }
    })
  },
  loadTjList:function(){
    request.get("/banner/list/3").then(res => {
      if (res.data.list.length != 0) {
        this.setData({
          tjList: res.data.list
        })
      }
    })
  },
  loadTopicList:function(){
    request.get("/banner/list/2").then(res => {
      if (res.data.list.length != 0) {
        this.setData({
          topicList: res.data.list
        })
      }
    })
  },
  loadTuijian: function () {
    let data = {};
    data.pageNum = 0;
    data.pageSize = 50;
    data.labelId = 1;
    request.get("/menu/list", data).then(res => {
      if (res.data.rows.length != 0) {
        this.setData({
          list: res.data.rows
        })
      }
    })
  },
  allCate:function(){
    wx.switchTab({
      url: '/pages/cate/cate',
    })
  },
  search:function(e){
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/qrlist/qrlist?keyword='+name,
    })
  }, 
  goLink:function(e) {
    let link = e.currentTarget.dataset.link;
    let redirectType = e.currentTarget.dataset.redirecttype;
    switch(redirectType) {
      case 2:
        wx.redirectTo({
          url: link,
        })
        break;
      case 3:
        wx.switchTab({
          url: link,
        })
        break;
      case 4:
        wx.reLaunch({
          url: link,
        })
        break;
      default:
        wx.navigateTo({
          url: link
        })
    }
    
  }
})