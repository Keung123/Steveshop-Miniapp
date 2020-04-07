// pages/main.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    isVIP: null,
    isAdmin: null,
    showTesting: null,
    weeklyKey: null,
    cardExpended: false,
    inviteCode: '',
  },

  reload: function() {
    this.setData({
      isVIP: app.globalData.isVIP,
      isAdmin: app.globalData.isAdmin,
    })
  },

  goInviteManager: function() {
    wx.navigateTo({
      url: '../invitemanager/invitemanager',
    })
  },

  changeTestingStatus: function() {
    this.setData({
      showTesting: !this.data.showTesting
    })
  },

  changeVIPStatus: function() {
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
    let inviteCode = this.data.inviteCode
    console.log(inviteCode)

    // check invite code
    let db = new wx.BaaS.TableObject('invitecode')
    let query = new wx.BaaS.Query()
    query.compare('used', '=', false)
    query.compare('code', '=', inviteCode)

    db.setQuery(query).find().then( res => {
      let result = res.data.objects

      // invite code matched
      if(result.length > 0) {
        
        // mark invite code used
        console.log(result[0].id)
        let record = db.getWithoutData(result[0].id)
        record.set('used', true)
        record.update()
        
        // update vip
        let vipDB = new wx.BaaS.TableObject('vip')
        let vipQuery = new wx.BaaS.Query()
        vipQuery.compare('openid', '=', app.globalData.openId)

        // check db history
        vipDB.setQuery(vipQuery).find().then( res => {
          let vipResult = res.data.objects
          let newData = {
            enabled: true,
            openid: app.globalData.openId,
            due_date: result[0].due_date,
            note: this.data.userInfo.nickName,
          }
          // old vip
          if(vipResult.length > 0) {
            let newRecord = vipDB.getWithoutData(vipResult[0].id)
            newRecord.set(newData).update().then(res => {
              // unlock ui
              wx.showToast({
                title: '激活成功',
              })
              this.setData({
                cardExpended: false
              })
              this.changeVIPStatus()
            }, err => {
              wx.showToast({
                title: '会员注册异常，请联系客服',
                icon: 'none'
              })
              console.log(err)
            })
          }
          // new vip
          else {
            let newRecord = vipDB.create()
            newRecord.set(newData).save().then(res => {
              // unlock ui
              wx.showToast({
                title: '激活成功',
              })
              this.setData({
                cardExpended: false
              })
              this.changeVIPStatus()
            }, err => {
              wx.showToast({
                title: '会员注册异常，请联系客服',
                icon: 'none'
              })
              console.log(err)
            })
          }
        }, err => {
          wx.showToast({
            title: '会员注册异常，请联系客服',
            icon: 'none'
          })
          console.log(err)
        })
      }
      // wrong invite code
      else {
        wx.showToast({
          title: '邀请码错误，请重试',
          icon: 'none',
        })
      }
    }, err => {
      wx.showToast({
        title: '验证失败，请重试',
        icon: 'none',
      })
      console.log(err)
    })
  },

  copyKey: function() {
    wx.setClipboardData({
      data: this.data.weeklyKey,
      success: res => {
        wx.showToast({
          title: '内容已复制',
          duration: 600          
        })
      },
      fail: res => {
        wx.showToast({
          title: '复制失败，请手动复制',
          icon: 'none',
          duration: 1000
        })
        this.expendCard()
      }
    })
  },

  sleep: function(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },
  

  onLoad: function () {
    
    this.setData({
      userInfo: app.globalData.userInfo,
      isVIP: app.globalData.isVIP,
      isAdmin: app.globalData.isAdmin,
      showTesting: false, 
    })

    this.sleep(1000).then(res => {
      this.reload()
    })

    let db = new wx.BaaS.TableObject('keys')
    let query = new wx.BaaS.Query()
    query.compare('usable', '=', true)

    db.setQuery(query).find().then(res => {
      let result = res.data.objects
      // has key
      if(result.length > 0) {
        this.setData({
          weeklyKey: result[0].key
        })
      }
    }, err => {
      wx.showToast({
        title: '获取失败，请重试',
        icon: 'none',
        duration: 1000
      })
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
  },

  onHide: function () {

  },


  onPullDownRefresh: function () {
    this.reload()
    wx.stopPullDownRefresh()
  }
})