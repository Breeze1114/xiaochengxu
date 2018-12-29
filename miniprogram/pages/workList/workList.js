// miniprogram/pages/workList/workList.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: app.globalData.token,
    taskId: app.globalData.task_id,
    workList:{},
    taskStatus: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://10.1.40.150:3080/api/app/checkUser/task/' + app.globalData.task_id + '/workList',
      data: {
        page:"1",
        rows:"10",
        state:"all"
      },
      header: { 'Authorization': 'Bearer ' + app.globalData.token },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res.data.data);
        that.data.workList = res.data.data;
        that.setData({
          workList: res.data.data
        })
      },
      fail: function (res) { console.log(res)},
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

  showWorkDetail: function(e) {
    var workId = e.currentTarget.id;
    var status = e.currentTarget.dataset.status;
    var work = JSON.stringify(e.currentTarget.dataset.work);
    //赋值给全局变量，在别的页面取 
    app.globalData.work_id = workId;
    wx.navigateTo({
      url: '../workDetail/workDetail?status=' + status + '&workId=' + workId + '&work='+work,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})