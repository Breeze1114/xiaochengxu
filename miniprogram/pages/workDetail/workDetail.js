// miniprogram/pages/workDetail/workDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: app.globalData.token,
    workId: app.globalData.work_id,
    workResult:{},
    workInfo:{},
    date:{
      value:'',
      disabled:false
    },
    dateFlage:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var status = options.status;
    var work = JSON.parse(options.work);
    var jumpUrl = '';
    that.setData({
      workId: options.workId,
      workInfo:work,
    })
    if(status === '已提交' || status === '已完成'){
      jumpUrl = 'http://10.1.40.150:3080/api/app/checkUser/work/' + that.data.workId + '/info';
    }else{
      jumpUrl = 'http://10.1.40.150:3080/api/app/checkUser/work/' + that.data.workId + '/info';
    }
    wx.request({
      url: jumpUrl,
      data: '',
      header: { 'Authorization': 'Bearer ' + app.globalData.token },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        that.data.workInfo = res.data.data;
        that.setData({
          workResult: res.data.data
        });
        var checkDate = that.data.workResult.check_date;
        if (checkDate != null) {
          that.setData({
            date:{
              value : checkDate,
              disabled : true
            },
            dateFlage: true
          })
        }
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

  showDate: function(e){
    var that = this;
    that.setData({
      date: e.detail.value
    })
    }
  
})