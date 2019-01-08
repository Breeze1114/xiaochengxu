// miniprogram/pages/workDetail/workDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: app.globalData.token,
    workId: app.globalData.work_id,
    workResult: {},
    workInfo: {},
    date: {
      value: '',
      disabled: false
    },
    list: [],
    index: 0,//数组循环的下标
    listIndex: 0,
    safeList: [],//作为中间量的结果list
    leaderList: [],
    approver: "请选择审核人员",
    disabled: false,//选择器是否可用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var status = options.status;
    var work = JSON.parse(options.work);
    var jumpUrl = '';
    that.setData({
      workId: options.workId,
      workInfo: work,
    });
    if (status === '已提交' || status === '已完成') {
      jumpUrl = 'http://10.1.40.150:3080/api/app/checkUser/work/' + that.data.workId + '/info';
    } else {
      jumpUrl = 'http://10.1.40.150:3080/api/app/checkUser/work/' + that.data.workId + '/info';
    }
    wx.request({
      url: jumpUrl,
      data: '',
      header: {
        'Authorization': 'Bearer ' + app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.data.workInfo = res.data.data;
        that.setData({
          workResult: res.data.data
        });
        if(status === '已提交' || status === '已完成'){
          var checkResult = that.data.workResult.matter_check_result;
          if (checkResult != null) {
            var resultList = [];
            for(var i= 0;i<checkResult.length;i++){
              resultList.push(checkResult[i].result);
            }
          }
          that.setData({
            date: {
              value: that.data.workResult.check_date,
              disabled: true
            },
            disabled: true,
            safeList: resultList,
            approver: res.data.data.audit_user_name
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    });
    wx.request({
      url: 'http://10.1.40.150:3080/api/app/org/getAuditUserList',
      data: '',
      header: {
        'Authorization': 'Bearer ' + app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          leaderList: res.data.data
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    });
    wx.request({
      url: 'http://10.1.40.150:3080/api/app/resultNameList',
      data: '',
      header: {
        'Authorization': 'Bearer ' + app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          list: res.data.data
        });
        var arr = that.data.safeList;
        var list = that.data.list;
        //给中间量的list初始化值
        for (var i = 0; i < list.length; i++) {
          arr.push("请输入检查结果");
        }
        that.setData({
          safeList: arr
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    });
  },

  showDate: function(e) {
    var that = this;
    that.setData({
      date: e.detail.value
    })
  },

  pickerValChange: function(e) {
    var that = this;
    var arr = that.data.safeList;
    var list = that.data.list;
    var value = e.detail.value;
    var index = e.currentTarget.dataset.index;
    //点击了哪个选择器，就修改哪个下标的值，然后就可以展示出去了
    arr[index] = list[value];
    that.setData({
      safeList: arr
    })
  },

  auditPickerChange: function(e) {
    var that = this;
    that.setData({
      approver: that.data.leaderList[e.detail.value].user_name
    })
  }
})