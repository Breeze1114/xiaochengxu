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
    list:[],
    result:"请输入检查结果",
    leaderList:[],
    approver:"请选择审核人员"
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
    });
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
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    });
    wx.request({
      url: 'http://10.1.40.150:3080/api/app/org/getAuditUserList',
      data: '',
      header: { 'Authorization': 'Bearer ' + app.globalData.token },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          leaderList: res.data.data
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    });
    wx.request({
      url: 'http://10.1.40.150:3080/api/app/resultNameList',
      data: '',
      header: { 'Authorization': 'Bearer ' + app.globalData.token },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          list: res.data.data
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

  showDate: function(e){
    var that = this;
    that.setData({
      date: e.detail.value
    })
  },

  pickerValChange: function(e){
    var that =this;
    that.setData({
      result: that.data.list[e.detail.value]
    })
  },

  auditPickerChange: function(e){
    var that = this;
    that.setData({
      approver: that.data.leaderList[e.detail.value].user_name
    })
  }
})