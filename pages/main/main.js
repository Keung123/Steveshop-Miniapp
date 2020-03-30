// pages/main.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    isVIP: null,
    weeklyKey: null,
  },

  reload: function() {
    this.setData({
      isVIP: app.globalData.isVIP
    })
  },

  testVIPStatus: function() {
    app.globalData.isVIP = !app.globalData.isVIP
    this.reload()
  },

  addSubscribe: function() {
    wx.showToast({
      title: '待开发：添加订阅',
      icon: 'none'
    })  
  },

  copyKey: function() {
    wx.setClipboardData({
      data: this.data.weeklyKey,
      success(res) {
        wx.showToast({
          title: '已复制到剪贴板',
          duration: 700          
        })
      },
      fail(res) {
        wx.showToast({
          title: '复制失败（待开发：手动复制）',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      isVIP: app.globalData.isVIP,
      weeklyKey: '',
    })
    wx.hideLoading({
      complete: (res) => {
        wx.showToast({
          title: '登陆成功',
          duration: 1000
        })
      }
    })
  },

  onShow: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    wx.hide
  },

  onHide: function () {

  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})