// pages/main.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isVIP: null,
    id: '', // 订阅消息模版 ID
  },

  handleIdChange(e) { // 订阅消息填写
    this.setData({
      id: e.detail.value,
    })
  },

  testVIPStatus: function() {
    app.globalData.isVIP = !app.globalData.isVIP
    this.setData({
      isVIP: app.globalData.isVIP
    })
    console.log(app.globalData.isVIP)
    console.log(this.data.isVIP)
  },

  addSubscribe: function() {
    wx.showToast({
      title: '待开发：添加订阅',
      icon: 'none'
    })  
  },

  copyKey: function() {
    wx.showToast({
      title: '待开发：复制密钥',
      icon: 'none'
    }) 
  },

  subscribeMessage: function (e) {
    wx.requestSubscribeMessage({
      tmplIds: [this.data.id],
      success: (res) => {
        // 用户在真机上同意上报订阅消息
        let subscription = []
        if (res[this.data.id] === 'accept') {
          subscription.push({
            template_id: this.data.id,
            subscription_type: 'once',
          })
        }
        wx.BaaS.subscribeMessage({subscription}).then(res => {
          // success
        }, err => {
          // error
        })
      },
      fail: (err) => {
        // fail
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      isVIP: app.globalData.isVIP
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      complete: (res) => {},
    })
    wx.hide
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

  }
})