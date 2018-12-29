var app = getApp();
var globalData = app.globalData;
Page({
  data:{
    tel:"",
    yzm:"",
    vCode:"",
    isVCode:false,
    vCodeImg:"",
    vCodeText:true,
    sCodeBtn: true, //是否发送验证码能点击
    InterValObj: '', //timer变量，控制时间
    count: 120, //间隔函数，1秒执行
    curCount: 120, //当前剩余秒数

    token:"",
    tuxing_value:"",

    fun_num01: 0
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    this.setData({
      fun_num01: true
    })
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  loginBtn(){
    var that=this;
    var _tel = that.data.tel;
    var _yzm = that.data.yzm;
    var reg = new RegExp('^1\\d{10}$');

    if (_tel == "") {
      my.showToast({
        type: 'none',
        content: '请输入手机号',
        duration: 3000,
        success: () => {

        },
      });
    } else if (!reg.test(_tel)) {
      my.showToast({
        type: 'none',
        content: '手机号码不符合要求',
        duration: 3000,
        success: () => {

        },
      });
    } else if (_yzm == '') {
      my.showToast({
        type: 'none',
        content: '请输入验证码',
        duration: 3000,
        success: () => {

        },
      });
    } else {
      my.showLoading({
        content: '加载中...'
      });
      var fun=function(){
        my.httpRequest({
          url: globalData.url + '/userMobileLogin.jhtm',
          method: 'POST',
          headers: {
            "Connection": "keep-alive",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          data: {
            "telephone": _tel,
            "checkCode": _yzm
          },
          dataType: 'json',
          success: function(res) {
            my.hideLoading();
            console.log(res)
            var data = res.data;
            if (data.error == '0') {
              my.setStorageSync({
                key: 'cookie',
                data: {
                  cookie: data.matrixContent,
                  tel: _tel
                }
              });
              // my.redirectTo({url: '/pages/index/index'})

              // my.navigateTo({ url: '/pages/index/index' });
              my.switchTab({
                url: '/pages/index/index'
              })
            } else if (data.error == 'error'){
              var _fun_num01 = that.data.fun_num01;
              if (_fun_num01>3){
                my.alert({ content: data.message });
              }else{
                fun();
              }
              
            }else {
              that.setData({
                sCodeBtn: true
              })

              my.alert({ content: data.message });
              clearInterval(that.data.InterValObj); //停止计时器
            }


          },
          fail: function(res) {
            console.log(res);
            my.hideLoading();
            // my.alert({ content: 'fail' });
          },
          complete: function(res) {
            var _fun_num01 = that.data.fun_num01;
            var _val = _fun_num01+1;
            that.setData({
              fun_num01: _val
            })
            console.log(res)

          }
        });
      }
      fun();
      // ************************
    }


  },
  yzm(){
    var that=this;
    var _tel=that.data.tel;
    var _vCode = that.data.vCode;
    var reg = new RegExp('^1\\d{10}$');
    if (_tel==""){
      my.showToast({
        type: 'none',
        content: '请输入手机号',
        duration: 3000,
        success: () => {
          
        },
      });
    } else if (!reg.test(_tel)){
      my.showToast({
        type: 'none',
        content: '手机号码不符合要求',
        duration: 3000,
        success: () => {

        },
      });
    }else{
      that.sendCode(_tel, _vCode)
    }
  },
  sendCode(_tel, _vCode, _token2){
    var that = this;
    my.showLoading({
      content: '加载中...'
    });
    console.log("_tel:"+_tel)
    my.httpRequest({
      url: globalData.url +'/code/getCheckCode.jhtm',
      method: 'POST',
      headers:{
        "Connection": "keep-alive",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {
        telphone: _tel,
        vCode: _vCode,
        token: _token2
      },
      dataType: 'json',
      success: function(res) {
        console.log(res)
        var data = res.data;
        if (data.resultCode == "SUCCESS") {
          that.sendMessage(0, 0);
          my.alert({ content: '已发送' });
        } else if (data.resultCode == "IMAGE_CODE") {
          that.sendMessage(2, 1);
          that.setData({
            sCodeBtn: true,
            vCodeText:false
          });
        } else if (data.resultCode == null || data.resultCode == "") {
          that.setData({
            sCodeBtn: true
          });
          my.alert({ content: '系统繁忙，请稍后再试!' });
        }else {
          my.alert({ content: data.resultDesc });
          that.setData({
            sCodeBtn: true
          });
        }
        
        
      },
      fail: function(res) {
        console.log(res)
        // my.alert({ content: 'fail' });
      },
      complete: function(res) {
        console.log(res)
        my.hideLoading();
      }
    });



  },
  sendMessage: function(status, propmstatus) {
    var that = this;
    if (status == 2) {
      
        my.httpRequest({
          url: globalData.url_sms,
          method: 'POST',
          headers: {
            "Connection": "keep-alive",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          data: {},
          dataType: 'json',
          success: function(res) {
            console.log(res)
            var data = res.data;

            var imgbase = data.image;
            var token = data.token;
            var tuxing_value = data.value;

            var imgbaseKon = imgbase.replace(/\s/g, "")
            var imgBase64 = "data:image/png;base64," + imgbaseKon;
            that.setData({
              vCodeImg: imgBase64,
              token: token,
              tuxing_value: tuxing_value,
              isVCode: true
            })




          },

        });
      
    }else{
      that.setData({
        sCodeBtn: false,
        curCount: that.data.count,
        InterValObj: setInterval(function() {
          that.SetRemainTime(that)
        }, 1000)
      })
    }
    

    // that.data.InterValObj = setInterval(that.SetRemainTime, 1000); //启动计时器，1秒执行一次
  },
  SetRemainTime: function(that) {
    // var that = this;
    if (that.data.curCount == 0) {
      clearInterval(that.data.InterValObj); //停止计时器
      that.setData({
        sCodeBtn: true
      })
      // code = ''; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
    } else {
      var _curCount = that.data.curCount - 1;
      that.setData({
        curCount: _curCount
      })
    }
  },
  bindKeyInputTel(e){
    var _val = e.detail.value;
    this.setData({
      tel: _val,
    });
  },
  bindKeyInputVCode(e){
    var _val = e.detail.value;
    this.setData({
      vCode: _val,
    });
  },
  bindKeyInputYz(e) {
    var _val = e.detail.value;
    this.setData({
      yzm: _val,
    });
  },
  vCodeOk(){
    var that=this;
    var _tel = that.data.tel;
    var _vCode = that.data.vCode;
    var _token = that.data.token;
    var _tuxing_value = that.data.tuxing_value;
    if (_vCode==""){
      // _tuxing_value

      my.showToast({
        type: 'none',
        content: '图形验证码，不能为空！',
        duration: 3000,
        success: () => {

        },
      });
    }else{
      if (_vCode.toLowerCase() !== _tuxing_value.toLowerCase()) {
        this.setData({
          vCodeText: false
        });
        that.sendMessage(2,2);
      }else{
        that.sendCode(_tel, _vCode, _token);
        this.setData({
          vCode: "",
          isVCode: false,
          sCodeBtn: true,
          vCodeText: true
        });
      }
      
    }
    
  },
  vCodeCancel(){
    this.setData({
      vCode: "",
      isVCode: false,
      sCodeBtn:true,
      vCodeText: false
    });
  },
  updateCode: function() {
    
    var _time = new Date();
    var that = this;
    // my.getImageInfo({
    //   src: globalData.url + '/getRandomVCode.jhtm?' + _time.getTime()+'.jpg',
    //   success: (res) => {
    //     that.setData({
    //       vCodeImg: res.path
    //     })
    //   }
    // })
    my.httpRequest({
      url: globalData.url_sms,
      method: 'POST',
      headers: {
        "Connection": "keep-alive",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: {},
      dataType: 'json',
      success: function(res) {
        console.log(res)
        var data = res.data;

        var imgbase = data.image;
        var token = data.token;
        var tuxing_value = data.value;

        var imgbaseKon = imgbase.replace(/\s/g,"")
        var imgBase64 = "data:image/png;base64," + imgbaseKon;
        that.setData({
          vCodeImg: imgBase64,
          token: token,
          tuxing_value: tuxing_value
        })
        
      },
      
    });
    
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '盛大养车',
      desc: '最优质的服务',
      path: 'pages/index/index',
    };
  },
});
