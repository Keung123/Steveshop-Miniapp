//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '只要出发，不要目的',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  getOpenId: res => {
    wx.BaaS.auth.getCurrentUser().then( user => {
      let id = user.get('openid')
      app.globalData.openId = id
      // console.log(app.globalData.openId)
      return res(true)
    })
  },

  fetchDB: res => {
    let adminUser = new wx.BaaS.TableObject('admin')
    let vipUser = new wx.BaaS.TableObject('vip')
    let query = new wx.BaaS.Query()
    query.compare('openid', '=', app.globalData.openId)
    
    // isAdmin?
    adminUser.setQuery(query).find().then( res => {
      let result = res.data.objects
      if(result.length > 0) {
        app.globalData.isAdmin = result[0].enabled
      }
      else {
        app.globalData.isAdmin = false
      }
    }, err => {
      wx.showToast({
        title: '获取数据库失败，请重新进入小程序',
        icon: 'none',
      })
      console.log(err)
    })

    // isVIP?
    vipUser.setQuery(query).find().then( res => {
      let result = res.data.objects
      if(result.length > 0) {
        app.globalData.isVIP = result[0].enabled
      }
      else {
        app.globalData.isVIP = false
      }
    }, err => {
      wx.showToast({
        title: '获取数据库失败，请重新进入小程序',
        icon: 'none',
      })
      console.log(err)
    })

    return res(true)
  },

  login: function() {
    this.getOpenId( res => {
      this.fetchDB( cb => {
        wx.redirectTo({
          url: '../main/main',
        })  
      })
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      wx.showLoading({
        title: '正在登陆',
      })
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true 
      })
      this.login()
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        wx.showLoading({
          title: '正在登陆',
        })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.login()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.showLoading({
            title: '正在登陆',
          })
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.login()
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  userInfoHandler(data) {
    wx.showLoading({
      title: '正在登陆',
    })
    wx.BaaS.auth.loginWithWechat(data, {syncUserProfile: 'overwrite'}).then(user => {
      // user 包含用户完整信息，详见下方描述
      console.log(user)
      this.login()
      wx.hideLoading({
        complete: (res) => {
          wx.showToast({
            title: '登陆成功',
            duration: 1000
          })
        }
      })
    }, err => {
      // **err 有两种情况**：用户拒绝授权，HError 对象上会包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 HError 对象
      wx.showToast({
        title: '用户授权失败，请重试',
        icon: 'none',
        duration: 1500,
        mask: true
      })
  })
  }
})
