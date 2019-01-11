// miniprogram/pages/login/login.js
var base64 = require('../../js/base64.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  fromSubmit: function(e) {
    wx.request({
      url: 'http://10.1.40.150:3080/api/auth',
      data: {
        username: e.detail.value.userName,
        password: base64.CusBASE64.encoder(e.detail.value.password)
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        app.globalData.token = res.data.token;
        wx.setStorage({//缓存token
          key: 'token',
          data: res.data.token,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        var timestampCache = Date.parse(new Date());
        wx.setStorage({//存一个过期时间
          key: 'outTime',
          data: {
            timestampCache: timestampCache,
            outTime: 1200000
          },
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        wx.navigateTo({
          url: '../taskList/taskList',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { console.log(res)},
      complete: function(res) {},
    })
  }
})