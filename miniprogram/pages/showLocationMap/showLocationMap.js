// miniprogram/pages/showLocationMap/showLocationMap.js
const app = getApp();
const common = require("../../js/common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"页面加载完成",
    array:['秀','天秀','陈独秀','蒂花之秀','造化钟神秀'],
    name : "tom",
    staffA: { firstName: 'guapi', lastName: 'li' },
    staffB: { firstName: 'nike', lastName: 'yang' },
    staffC: { firstName: 'geda', lastName: 'jiang' }
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

  helloKuGou() {
    common.sayHello("KuGou")
  },

  goodBeySon() {
    common.sayGoodbye("My Son")
  },

  clickMe : function(event){
    console.log(event)
  }
})