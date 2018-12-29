var app = getApp();
var globalData = app.globalData;
Page({
  data:{
    loadNum:1,
    isErbox:true,
    erbox:"没有记录",
    erbox02: "数据正在加载...",


    navList: [{
        name:"全部"
      },{
        name: "可使用"
      }, {
        name: "已完成"
      }, {
        name: "退款"
    }],
    navListCuIndex:0,
    list:[],
      //status == 0未付款
      //status == 1未消费--未过期
      //status == 5已消费
      //status == 6 7未消费--已过期  已退款
    list_0: [],
    list_1: [],
    list_5: [],
    list_6_7: [],

    fun_num01:0,
    fun_num02:0
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    if (query.index){
      this.setData({
        navListCuIndex: query.index
      });
    }
    this.getDate();
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.setData({
      fun_num01: 0,
      fun_num02:0
    });
    this.getDate();
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
  tuikuan(event){
    // my.alert({ content: "退款功能持续开发中！" });
    var orderId = event.target.dataset.orderId;
    var that=this;
    
    my.confirm({
      title: '温馨提示',
      content: '确定退款吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.showLoading({
            content: '加载中...'
          });
          var fun = function() {
            my.httpRequest({
              url: globalData.url + '/order/refundOrder.jhtm',
              method: 'POST',
              headers: {
                "Connection": "keep-alive",
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              data: {
                orderId: orderId
              },
              dataType: 'json',
              success: function(res) {
                my.hideLoading();
                var data = res.data;
                if (data.error == 0) {
                  var result = data.result;
                  var obj = JSON.parse(result);
                  if (obj.refund_result == "Y") {
                    my.alert({
                      content: "退款成功！",
                      success: () => {
                        that.getDate();

                      }
                    });
                  } else {
                    my.alert({
                      content: "退款失败！",
                      success: () => {
                        that.getDate();

                      }
                    });
                  }
                } else if (data.error == "error") {
                  var _fun_num01 = that.data.fun_num01;
                  if (_fun_num01>3){
                    my.alert({
                      content: data.message
                    });
                  }else{
                    my.showLoading({
                      content: '加载中...'
                    });
                    fun();
                  }
                  

                } else {
                  my.alert({
                    content: data.message
                  });
                }



              },
              fail: function(res) {
                my.hideLoading();
                console.log(res)
                my.alert({ content: '网络连接失败！' });
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


        }
      },
    });
    
  },
  navTap(event){
    var that=this;
    var _index = event.target.dataset.index;
    var _navListCuIndex = that.data.navListCuIndex;
    if (_index != _navListCuIndex){
      that.setData({
        navListCuIndex: _index
      });
      this.getDate();
    }
   
    
  },
  getDate(){
    var that=this;
    var storageData = my.getStorageSync({ key: 'cookie' });
    if (storageData.data) {
      var cookie = storageData.data.cookie;
      if (cookie) {
  // 
        // 页面加载
        my.showLoading({
          content: '加载中...'
        });
        that.setData({
          isErbox:true
        });
        var fun=function(){
          my.httpRequest({
            url: globalData.url + "/order/orderListQuery.jhtm",
            method: 'POST',
            headers: {
              "Connection": "keep-alive",
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
              cookie: cookie
            },
            dataType: 'json',
            success: function(res) {
              my.hideLoading();
              var data = res.data;
              if (data.error == "0") {

                var _orders = data.orders;
                var list_0 = [];
                var list_1 = [];
                var list_5 = [];
                var list_6_7 = [];


                //status == 0未付款 list_0
                //status == 1未消费--未过期list_1
                //status == 5已消费list_5
                //status == 6 7未消费--已过期  已退款list_6_7
                if (_orders) {
                  _orders.map(function(item, index) {
                    if (item.status == "0") {
                      list_0.push(item);
                    } else if (item.status == "1") {
                      list_1.push(item);
                    } else if (item.status == "5") {
                      list_5.push(item);
                    } else if (item.status == "6" || item.status == "7") {
                      list_6_7.push(item);
                    }
                  });
                }

                setTimeout(function() {
                  that.setData({
                    isErbox: false
                  });
                }, 1000)
                that.setData({
                  list: _orders,
                  list_0: list_0,
                  list_1: list_1,
                  list_5: list_5,
                  list_6_7: list_6_7
                });
              } else if (data.error == "error") {
                var _fun_num02 = that.data.fun_num02;
                if (_fun_num02>3){
                  setTimeout(function() {
                    that.setData({
                      isErbox: false
                    });
                  }, 1000)
                  my.alert({ content: data.message });
                }else{
                  my.showLoading({
                    content: '加载中...'
                  });


                  fun();
                }
                
              } else {
                setTimeout(function() {
                  that.setData({
                    isErbox: false
                  });
                }, 1000)
                my.alert({ content: data.message });
              }
              console.log(res)

            },
            fail: function(res) {
              console.log(res)
              // my.alert({ content: '网络连接失败！' });
            },
            complete: function(res) {
              
              var _fun_num02 = that.data.fun_num02;
              var _val = _fun_num02 + 1;
              that.setData({
                fun_num02: _val
              });
            }
          });
        }
        fun();
      // 
      }else{
        my.navigateTo({ url: '/pages/login/login' });
      }
    }else{
      my.navigateTo({ url: '/pages/login/login' });
    }
    
  },
  goUse(event){
    var orderId=event.target.dataset.orderId;
    var imgicon = event.target.dataset.img;

    if (imgicon){
      my.setStorageSync({
        key: 'imgicon',
        data: {
          imgicon: imgicon
        }
      });
    }
    
    my.navigateTo({ url: '/pages/record_detail/record_detail?orderId=' + orderId });
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
