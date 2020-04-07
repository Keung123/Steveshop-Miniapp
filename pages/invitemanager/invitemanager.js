// pages/invitemanager/invitemanager.js
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: null,
    codeTime: '',
    codeLength: 0,
    codeNote: '',
    inviteCodeDB: null,
    codeList: [],
    codeList_active: [],
    displayManual: false,
    codeCopy: '',
  },

  bindInputBlur: function(e) {
    this.setData({
      codeNote: e.detail.value,
    })
  },

  changeDisplayStatus: function() {
    this.setData({
      displayManual: false,
    })
  },

  toCode: function (str) {  //加密字符串
    //定义密钥，36个字母和数字
    let key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let len = key.length  //获取密钥的长度
    let a = key.split("") //把密钥字符串转换为字符数组
    let s = "", b, b1, b2, b3  //定义临时变量
    for (let i = 0; i <str.length; i ++) {  //遍历字符串
        b = str.charCodeAt(i) //逐个提取每个字符，并获取Unicode编码值
        b1 = b % len          //求Unicode编码值得余数
        b = (b - b1) / len    //求最大倍数
        b2 = b % len          //求最大倍数的于是
        b = (b - b2) / len    //求最大倍数
        b3 = b % len          //求最大倍数的余数
        s += a[b3] + a[b2] + a[b1]  //根据余数值映射到密钥中对应下标位置的字符
    }
    return s;  //返回这些映射的字符
  }, 

  generateInviteCode: function() {
    let currentTime = util.formatTime(new Date())
    return this.toCode(currentTime)
  },


  calculateTimeLength: function() {
    if(typeof(this.data.codeTime) != 'string') {
      return null
    }
    let currentDate = new Date()
    let targetDate = new Date(Date.parse(this.data.codeTime))

    let msDiff = targetDate.getTime() - currentDate.getTime()
    return Math.floor(msDiff / (24 * 60 * 60 * 1000))
  },

  bindDateChange: function(e) {
    this.setData({
      codeTime: e.detail.value.replace(new RegExp(/-/g),'/'),
    })
    this.setData({
      codeLength: this.calculateTimeLength()
    })
  },

  addDB: function() {
    let newRecord = this.data.inviteCodeDB.create()
    let newData = {
      code: this.data.code,
      due_date: this.data.codeTime,
      length: this.data.codeLength + '天',
      used: false,
      note: this.data.codeNote,
    }
    newRecord.set(newData).save().then(res => {
      // success
      // console.log(res)
      wx.showToast({
        title: '已添加至服务器',
        duration: 1000,
      })
    }, err => {
      console.log(err)
      wx.showToast({
        title: '添加失败请重试',
        icon: 'none',
      })
    })
  },

  fetchDB: function() {
    let query = new wx.BaaS.Query()
    query.compare('used', '=', false)

    this.data.inviteCodeDB.setQuery(query).find().then( res => {
      let result = res.data.objects
      this.setData({
        codeList: result,
      })

      console.log(this.data.codeList)
      console.log(this.data.codeList.length)
    }, err => {
      wx.showToast({
        title: '获取失败，请重试',
        icon: 'none',
      })
      console.log(err)
    })
  },

  copyCode: function(code) {
    wx.setClipboardData({
      data: code,
      success: res => {
        wx.showToast({
          title: '邀请码已复制',
          duration: 600          
        })
      },
      fail: res => {
        wx.showToast({
          title: '复制失败，请手动复制',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          displayManual: true,
          copyCode: code,
        })
      }
    })
  },

  bindGenerateButton: function() {
    if(this.data.codeTime == '') {
      wx.showToast({
        title: '请填写有效时长',
        icon: 'none',
      })
      return
    }
    this.setData({
      code: this.generateInviteCode()
    })
    // console.log(this.data.code)
    // console.log(this.data.codeLength)
    // console.log(this.data.codeTime)

    this.addDB()
    this.copyCode(this.data.code)
    this.fetchDB()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      inviteCodeDB: new wx.BaaS.TableObject('invitecode')
    })
    this.fetchDB()
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
    this.fetchDB()
  },
})