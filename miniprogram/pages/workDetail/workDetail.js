// miniprogram/pages/workDetail/workDetail.js
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../js/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5ARBZ-WIR3K-2AIJN-AQCZC-YQLM6-KLBAQ' // 开发者秘钥
}); 

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
    index: 0, //数组循环的下标
    listIndex: 0,
    safeList: [], //作为中间量的结果list
    leaderList: [],
    approver: "请选择审核人员",
    approverId: '', //审批人id
    disabled: false, //选择器是否可用
    checked: true, //是否选中
    placeholder: '请输入主要检查内容', //提示内容
    checkResult: '', //检查结果
    radioValue: '合格', //单选框默认值
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
        console.log('检查结果', res.data.data)
        that.setData({
          workResult: res.data.data
        });
        if (status === '已提交' || status === '已完成') {
          var checkResult = that.data.workResult.matter_check_result;
          var isPass = res.data.data.is_pass;
          var checked;
          if (isPass === '合格') {
            checked = true;
          } else if (isPass === '不合格') {
            checked = false;
          }
          if (checkResult != null) {
            var resultList = [];
            for (var i = 0; i < checkResult.length; i++) {
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
            approver: res.data.data.audit_user_name,
            checked: checked,
            checkResult: res.data.data.check_result,
            placeholder: '', //提示文本清空
          })
        } else if (status === '暂存') {
          var checkResult = that.data.workResult.matter_check_result;
          var isPass = res.data.data.is_pass;
          var checked;
          if (isPass === '合格') {
            checked = true;
          } else if (isPass === '不合格') {
            checked = false;
          }
          if (checkResult != null) {
            var resultList = [];
            for (var i = 0; i < checkResult.length; i++) {
              resultList.push(checkResult[i].result);
            }
          }
          that.setData({
            date: {
              value: that.data.workResult.check_date,
              disabled: false
            },
            disabled: false,
            safeList: resultList,
            approver: res.data.data.audit_user_name,
            approverId: res.data.data.audit_user_id,
            checked: checked,
            checkResult: res.data.data.check_result,
            placeholder: '', //提示文本清空
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
      date: {
        value: e.detail.value
      }
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
      approver: that.data.leaderList[e.detail.value].user_name,
      approverId: that.data.leaderList[e.detail.value].user_id
    })
  },

  checkChange: function(e) {
    var that = this;
    that.setData({
      radioValue: e.detail.value
    })
  },

  saveEntry: function(e) {
    var that = this;
    // wx.setStorage({ //检查结果明细
    //   key: 'checkResult',
    //   data: that.data.checkResult,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    // wx.setStorage({ //检查日期
    //   key: 'checkDate',
    //   data: that.data.date.value,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    // wx.setStorage({ //是够合格
    //   key: 'checkValue',
    //   data: that.data.radioValue,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    // wx.setStorage({ //检查结果列表
    //   key: 'matterResult',
    //   data: that.data.safeList,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    // wx.setStorage({ //审批人
    //   key: 'approver',
    //   data: that.data.approver,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

    var matterCheckResultList = [];
    var checkResult = {};
    var list = that.data.workInfo.matter;
    for (var i = 0; i < list.length; i++) {
      checkResult = {
        code: list[i].code,
        name: list[i].name,
        result: that.data.safeList[i],
        law: '',
        remark: ''
      }
      matterCheckResultList.push(checkResult);
    }
    debugger;
    wx.request({
      url: 'http://10.1.40.150:3080/api/app/checkUser/work/' + that.data.workId + '/submitCheckResult',
      data: {
        check_result: that.data.checkResult,
        operate: '暂存',
        check_date: that.data.date.value,
        is_pass: that.data.radioValue,
        audit_user_id: that.data.approverId,
        audit_user_name: that.data.approver,
        matter_check_result: matterCheckResultList,
        files:[]
      },
      header: {
        'Authorization': 'Bearer ' + app.globalData.token
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {console.log(res)},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  reset: function(e) {

  },

  submit: function(e) {
    console.log(e);
  },

  uploadFile: function(e) {
    wx.chooseImage({
      count: 1,
      sizeType: [],
      sourceType: [],
      success: function(res) {
        console.log(res);
        var filePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'http://10.1.40.150:3080/api/app/upload/result',
          filePath: filePaths[0],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data",
            'Authorization': 'Bearer ' + app.globalData.token
          },
          success: function(res) {console.log(res)},
          fail: function(res) {},
          complete: function(res) {},
        })

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //导航方法
  gotoLocation: function(e){
    var that = this;
    //地址转坐标
    qqmapsdk.geocoder({
      address: that.data.workInfo.business_address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据经纬度，打开导航
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 18,
          name: that.data.workInfo.business_address,
          address: that.data.workInfo.business_address,
          success: function (res) { console.log(res) },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  //文本区域完成输入方法
  endInput: function(e){
    var that = this;
    if(e.detail){
      that.setData({
        checkResult: e.detail.value
      })
    }
  }
})