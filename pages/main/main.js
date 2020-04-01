// pages/main.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    isVIP: null,
    weeklyKey: null,
    cardExpended: false,
    inviteCode: '',
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

  testCardExpend: function() {
    this.setData({
      cardExpended: !this.data.cardExpended
    })
  },

  expendCard: function() {
    this.setData({
      cardExpended: true
    })
  },

  foldCard: function() {
    this.setData({
      cardExpended: false
    })
  },

  bindInputBlur: function(e) {
    this.setData({
      inviteCode: e.detail.value,
    })
  },

  addSubscribe: function() {
    console.log(this.data.inviteCode)
    this.setData({
      cardExpended: false
    })
    this.testVIPStatus()
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
          title: '复制失败，请手动复制',
          icon: 'none',
          duration: 1000
        })
        this.expendCard()
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      isVIP: app.globalData.isVIP,
      weeklyKey: 'Test',
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