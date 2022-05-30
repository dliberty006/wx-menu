// pages/detail/detail.js
const request = require("../../utils/request");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuVo:{},
    list:[],
    isCollection:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let menuId = options.menuId;
    this.loadMenu(menuId);
    
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
    let title = "「" + this.data.menuVo.menuName+"」的做法，推荐给你试试~";
    return {
      title: title,
      path: '/pages/index/index?menuId=' + this.data.menuVo.id
    }
  },
  loadMenu:function(menuId) {
    request.get("/menu/view/"+menuId).then(res => {
      this.setData({
        menuVo: res.data.menuVo
      })
      wx.setNavigationBarTitle({
        title: res.data.menuVo.menuName
      })
      this.isCollection(menuId)
      this.loadTuijian(res.data.menuVo.categoryId);
    })
  },
  loadTuijian: function (cateId) {
    let data = {};
    data.pageNum = 0;
    data.pageSize = 11;
    data.categoryId = cateId;
    request.get("/menu/list", data).then(res => {
      if (res.data.rows.length != 0) {
        this.setData({
          list: res.data.rows
        })
      } 
    })
  },
  isCollection(menuId){
    request.get("/menu/collection/" + menuId).then(res => {
      if (res.data.collections && res.data.collections.length > 0) {
        this.setData({
          isCollection: true
        })
      }
    })
  },
  collection() {
    let menuId = this.data.menuVo.id;
    request.get("/menu/collection/add/" + menuId).then(res => {
      if (res.data.collection) {
        this.setData({
          isCollection: true
        })
        wx.showToast({
          title: '收藏成功',
          icon:'success'
        })
      }
    })
  },
  unCollection() {
    let menuId = this.data.menuVo.id;
    request.get("/menu/collection/remove/" + menuId).then(res => {
      this.setData({
        isCollection: false
      })
      wx.showToast({
        title: '取消成功',
        icon: 'success'
      })
    })
  },
  goDetail: function (e) {
    let menuid = e.currentTarget.dataset.menuid
    wx.navigateTo({
      url: '/pages/detail/detail?menuId=' + menuid,
    })
  },
  search: function (e) {
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/qrlist/qrlist?keyword=' + name,
    })
  }, 
  errorImage:function(e) {
    let index = e.currentTarget.dataset.index
    let menuVo = this.data.menuVo
    menuVo.stepList[index].showImg = true
    this.setData({
      menuVo:menuVo
    })
  }
})