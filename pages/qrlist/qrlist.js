// pages/qrlist/qrlist.js
const request = require("../../utils/request");
const history_search_cache_key = 'history_search_cache_key';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateId:'',
    cateName:'',
    keyword:'',
    pageSize:20,
    pageNum:0,
    height:'',
    list:[],
    isFromSearch: true,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    clickInput:false,
    inputShowed:false,
    historySearch:[],
    hotSearch: ['素菜', '茄子', '家常味', '面食', '糖醋排骨', '早餐', '可乐鸡翅', '煲汤', '中餐', '晚餐', '牛肉', '猪肉']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory();
    //this.addHistory('快手');
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })

    if (options.type && options.type == 1) {
      this.setData({
        clickInput:true,
        inputShowed:true
      })
    } else {
      let cateId = options.cateId;
      let cateName = options.cateName;
      let keyword = options.keyword;
      if (cateId) {
        this.setData({
          cateId: cateId,
          cateName: cateName,
          keyword: cateName
        })
      } else {
        this.setData({
          keyword: keyword
        })
      }
      
      this.fetchSearchList();
    }

    
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
  //搜索，访问网络  
  fetchSearchList: function () { 
    let list = this.data.list;
    let data = {};
    data.pageNum = this.data.pageNum;
    data.pageSize = this.data.pageSize;
    data.keyword = this.data.keyword;
    data.categoryId = this.data.cateId;

    this.addHistory(this.data.keyword);
    request.get("/menu/list", data).then(res => {
      if (res.data.rows.length != 0) {
        if (this.data.pageNum == 0) {
          list = res.data.rows
        } else {
          list.push(...res.data.rows)
        }
        
        this.setData({
          list: list,
          isFromSearch:true,
          searchLoading:true,
          searchLoadingComplete:false
        })
      } else {
        this.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
     
    })
    
  }, 
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete && that.data.isFromSearch) {
      that.setData({
        pageNum: that.data.pageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },
  goDetail:function(e){
    let menuid = e.currentTarget.dataset.menuid
    wx.navigateTo({
      url: '/pages/detail/detail?menuId='+menuid,
    })
  },
  changeKw:function(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search:function(){
    if (!this.data.keyword) {
      return;
    }
    this.setData({
      cateId:'',
      cateName:'',
      pageNum:0,
      clickInput:false,
      list:[]
    })
    this.fetchSearchList();
  },
  addHistory:function(kw) {
    if (!kw) {
      return;
    }
    let historySearch = this.data.historySearch;
    this.removeArrays(historySearch,kw);
    historySearch.unshift(kw)
    if (historySearch.length > 8) {
      historySearch.pop();
    }
    this.setData({
      historySearch: historySearch
    })
    wx.setStorage({
      key: history_search_cache_key,
      data: historySearch.join(",")
    })
  },
  getHistory:function() {
    let historySearchStr = wx.getStorageSync(history_search_cache_key);
    if (historySearchStr) {
      this.setData({
        historySearch: historySearchStr.split(",")
      })
    }
    
    
  },
  removeHistory:function(){
    wx.removeStorage({
      key: history_search_cache_key,
      success: function(res) {},
    })
    this.setData({
      historySearch: []
    })
  },
  removeArrays:function(arrays,item){
    for (var i = 0; i < arrays.length; i++) {
      if (arrays[i] == item) {
        arrays.splice(i, 1);
        break;
      }
    }
  },
  clickInput:function(){
    this.setData({
      clickInput:true
    })
  },
  fastSearch:function(e){
    let name = e.currentTarget.dataset.name
    this.setData({
      keyword: name
    })
    this.search()
  }
})