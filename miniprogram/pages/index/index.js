//index.js
const app = getApp()

// 引入SDK核心类
var QQMapWX = require('../../js/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '5ARBZ-WIR3K-2AIJN-AQCZC-YQLM6-KLBAQ' // 开发者秘钥
}); 

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    //从缓存拿token，实现自动登录，过期自动清除缓存
    wx.getStorage({
      key: 'outTime',
      success: function(res) {
        var timestamp = Date.parse(new Date());
        var timestampCache = res.data.timestampCache;
        if((timestamp - timestampCache) > res.data.outTime){
          console.log("过期了");
          wx.showToast({
            title: '登录信息已过期！请重新登录',
            icon: '',
            image: '',
            duration: 1500,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
          wx.removeStorage({
            key: 'token',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          wx.removeStorage({
            key: 'outTime',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          wx.navigateTo({
            url: '../login/login',
            success: function (res) { 
              wx.hideToast();  
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          app.globalData.token = res.data;
          wx.navigateTo({
            url: '../taskList/taskList',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  //问候语函数
  hello :function(){
    wx.getSystemInfo({
      success: function (res) { console.log(res) },
    })
    qqmapsdk.geocoder({
      address: '珠海市香洲区唐家湾镇金凤路6号', //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
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
          name: '北京理工大学珠海学院',
          address: '珠海市香洲区唐家湾镇金凤路6号',
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
    this.setData({
      massage:"hello world"
    })
  },

  //点我函数
  clickFun : function(){
    this.setData({
      text:"你点我，我就出来了"
    })
  },

//扫一扫
  saoyisaoFun : function(){
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: function (res) { console.log(res + '调用成功') },
      fail: function (res) { console.log(res + '调用失败') },
      complete: function (res) { console.log(res+'调用结束') },
    })
  },

 getLocationFun : function(){
   wx.getLocation({
     type: 'gcj02 ',
     altitude: true,
     success: function (res) {
       console.log(res);
       wx.openLocation({
         latitude: res.latitude,
         longitude: res.longitude,
         scale: 18,
         name: '北京理工大学珠海学院',
         address: '广东省珠海市香洲区唐家湾镇金凤路6号',
         success: function (res) { console.log(res) },
         fail: function (res) { },
         complete: function (res) { },
       })
     },
     fail: function (res) { },
     complete: function (res) { },
   })
 },


 getMapPage : function(){
   wx.navigateTo({
     url: '../showLocationMap/showLocationMap',
     success: function(res) {console.log("跳转成功")},
     fail: function (res) { console.log("跳转失败")},
     complete: function (res) { console.log("跳转结束")},
   })
 },

 getLoginPage : function(){
   wx.cloud.callFunction({
     name: 'helloWorld',
     data: {},
     success: res => {
       app.globalData.openid = res.result.openid
       wx.navigateTo({
         url: '../login/login',
         success: function (res) {},
         fail: function (res) { },
         complete: function (res) { },
       })
     },
     fail: err => {
       console.error('[云函数] [helloWorld] 调用失败', err)
       wx.navigateTo({
         url: '../deployFunctions/deployFunctions',
       })
     }
   })
  }
})
