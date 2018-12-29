var app = getApp();
var globalData = app.globalData;
Page({
  data:{
    ename:"",
    price: "",
    activityName: "",
    activityId: "",
    orderId:"",
    longitude:"",
    latitude:"",

    fun_num01:0,
    fun_num02: 0
  },
  onLoad(query) {
    // 页面加载
    var that=this;
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    var ename = query.ename;
    var price = query.price;
    var activityName = query.activityName;
    var orderId = query.orderId;
    var longitude = query.longitude;
    var latitude = query.latitude;
    
    that.setData({
      ename: ename,
      price: price,
      activityName: activityName,
      orderId: orderId,
      latitude: latitude,
      longitude: longitude
    });
    console.log("orderId:" + orderId)
    // that.payResult(orderId);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    this.setData({
      fun_num01: 0,
      fun_num02: 0
    });
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
  payBtn(){
    // my.alert({ content: globalData.authCode})
   
    var that=this;
    my.showLoading({
      content: '加载中...'
    });
    my.getAuthCode({
      success: (res) => {
        
        that.postPay(res.authCode);
      },
    });
   
    
  },
  postPay(authCode){
    var that=this;
    var storageData = my.getStorageSync({ key: 'cookie' });
    var cookie = storageData.data.cookie;
    var orderId = this.data.orderId;
    
    var ename = this.data.ename;
    var price = this.data.price;

    var fun=function(){
      my.httpRequest({
        url: globalData.url + '/order/pay.jhtm',//须加httpRequest域白名单
        method: 'POST',
        data: {//data里的key、value是开发者自定义的
          orderId: orderId,
          cookie: cookie,
          authCode: authCode,
          subject: ename
        },
        dataType: 'json',
        success: function(res) {
          my.hideLoading();
          var data = res.data;
          if (data.error == "0") {
            var frontPay = JSON.parse(data.frontPay);
            my.tradePay({
              tradeNO: frontPay.trade_no, // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
              success: (res) => {

                var resultCode = res.resultCode;
                var resTest = "订单支付成功";
                switch (resultCode) {

                  case 4000:
                    resTest = "订单支付失败";
                    my.alert({
                      content: resTest,
                    });
                    break;
                  case 6001:
                    resTest = "用户中途取消";
                    my.alert({
                      content: resTest,
                    });
                    break;
                  case 6002:
                    resTest = "网络连接出错";
                    my.alert({
                      content: resTest,
                    });
                    break;
                  case 99:
                    resTest = "用户点击忘记密码导致快捷界面退出";
                    my.alert({
                      content: resTest,
                    });
                    break;
                  default:
                    // resTest = "支付结果未知，请查看订单";
                    // my.alert({
                    //   content: resTest,
                    //   success: () => {
                    //     my.navigateTo({ url: '/pages/record/record' });

                    //   }
                    // });
                    that.payResult(orderId);
                }


              },
              fail: (res) => {
                my.alert({
                  content: "支付失败",
                });
              }
            });
          } else if (data.error == "error"){
            var _fun_num01 = that.data.fun_num01;
            if (_fun_num01>3){
              my.alert({
                content: data.message,
              });
            }else{
              fun();
            }
            
          }else {
            my.alert({
              content: data.message,
            });
          }


        },
        fail: function(res) {
          my.alert({ content: '支付失败' });
        },
        complete: function(res) {
          var _fun_num01 = that.data.fun_num01;
          var _val = _fun_num01+1;
          that.setData({
            fun_num01: _val
          });
        }
      });
    }
    fun();
    
  },
  payResult(orderId){
    var that=this;
    my.showLoading({
      content: '加载中...'
    });
    var fun=function(){
      my.httpRequest({
        url: globalData.url + '/single-query.jhtm',//须加httpRequest域白名单
        method: 'POST',
        headers: {
          "Connection": "keep-alive",
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: {
          orderId: orderId,
        },
        dataType: 'json',
        success: function(res) {
          console.log("single-query.jhtm")

          var data = res.data;
          console.log(data);
          if (data.error == "0") {
            my.hideLoading();
            if (data.sign == "1") {
              var longitude = that.data.longitude;
              var latitude = that.data.latitude;
              my.navigateTo({
                url: '/pages/pay_success/pay_success?orderId=' + orderId + '&latitude=' + latitude + '&longitude=' + longitude });
            } else {
              my.alert({
                content: "支付失败,如果已付款请查看我的订单",
                success: () => {
                  my.navigateTo({ url: '/pages/record/record' });
                }
              });
            }
          } else if (data.error == "error"){
            var _fun_num02 = that.data.fun_num02;
            if (_fun_num02>3){
              my.alert({ content: data.message });
            }else{
              my.showLoading({
                content: '加载中...'
              });
              fun();
            }
            
          }else {
            my.alert({ content: data.message });
          }



        }, fail: function(res) {
          console.log("single-query.jhtm res")
          console.log(res)
          my.hideLoading();
          my.alert({ content: '支付失败' });
        },
        complete: function(res) {
          var _fun_num02 = that.data.fun_num02;
          var _val = _fun_num02 + 1;
          that.setData({
            fun_num02: _val
          });
        }
      })
    }
    fun();
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
