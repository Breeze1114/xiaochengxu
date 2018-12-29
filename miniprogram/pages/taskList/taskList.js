// miniprogram/pages/taskList/taskList.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: app.globalData.token,
    taskList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this//搭桥，直接用this访问不了
      wx.request({
        url: 'http://10.1.40.150:3080/api/app/checkUser/taskList',
        data: {
          page : 1,
          rows: 10
        },
        header: { 'Authorization': 'Bearer '+app.globalData.token },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) { 
          console.log(res.data.data)
          that.data.taskList = res.data.data
          console.log(that.data.taskList)
          that.setData({
            taskList : res.data.data
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
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

  showWorkList : function(e){
    var taskId = e.currentTarget.id;
    //赋值给全局变量，在别的页面取 
    app.globalData.task_id = taskId;
    wx.navigateTo({
      url: '../workList/workList',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})