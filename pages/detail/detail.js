var app = getApp();
var globalData = app.globalData;
Page({
  data: {

    eid:"",
    latitude: "",
    longitude: "",
    imgicon: "",
    ename: "",
    ordercount: "",
    telphone: "",
    address: "",
    distance:"",
    sASelect:0,
    "shopActivities": [],

    fun_num01: 0,
    fun_num02: 0

  },
  onLoad(query) {
    // 页面加载
    var that = this;
    var allDataStr = query.hi;
    var allData=JSON.parse(allDataStr);
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    console.log(typeof allData)
    
    
    var _position = allData.position;
    console.log(_position)
    var latitude="";
    var longitude="";
    if (_position){
      var positionSp = _position.split(",");
      var newLn = this.bd_decrypt(positionSp[0], positionSp[1]);
      latitude = newLn.lat;
      longitude = newLn.lng;
    }
    

    this.setData({
      eid: allData.eid,
      latitude: latitude,
      longitude: longitude,
      imgicon: allData.imgicon,
      ename: allData.ename,
      ordercount: allData.ordercount,
      telphone: allData.telphone,
      address: allData.address,
      distance: allData.distance
    })
    that.getData(allData.eid);
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
  getData(shopId) {
    // 页面加载
    var that=this;
    
    my.showLoading({
      content: '加载中...'
    });
    console.log("shopId："+shopId)
    var fun = function() {
      my.httpRequest({
        url: globalData.url + '/shop/queryShopActivities.jhtm',
        method: 'POST',
        headers: {
          "Connection": "keep-alive",
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: {
          shopId: shopId
        },
        dataType: 'json',
        success: function(res) {
          my.hideLoading();
          var data = res.data;
          console.log(data)
          if (data.error == "0") {

            var shopActivities = data.shopActivities;
            that.setData({
              shopActivities: shopActivities
            });

          } else if (data.error == "error") {
            my.showLoading({
              content: '加载中...'
            });
            that.getData(that.data.eid);
          } else if (data.error == "error") {
            var _fun_num01 = that.data.fun_num01;
            if (_fun_num01>3){
              my.alert({ content: data.message });
            }else{
              fun();
            }
            
          } else {
            my.alert({ content: data.message });
          }
          console.log(res)

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
  },
  handleSelcet(event){
    var that=this;
    var activityId = event.target.dataset.activityId;
    var index = event.target.dataset.index;
    var sASelect = this.data.sASelect;
    if (index != sASelect){
        that.setData({
          sASelect: index
        });
    }
  },
  makePhoneCall() {
    var tel = this.data.telphone;
    var newTel = tel.replace(/[^0-9]/ig, "");
    my.confirm({
      title: '温馨提示',
      content: '是否拨打电话：' + tel,
      confirmButtonText: '拨打',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm){
          my.makePhoneCall({ number: newTel })
        }
      },
    });
    
  },
  daohan(){
    var name = this.data.ename;
    var address = this.data.address;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    
    
    // my.navigateTo({ url: '/pages/map/map?name=' + name + '&address=' + address + '&latitude=' + latitude + '&longitude=' + longitude});

    my.openLocation({
      longitude: longitude,
      latitude: latitude,
      name: name,
      address: address,
    })
  },
  pay(){
    var that = this;
    var shopId=that.data.eid;
    var sASelect = that.data.sASelect;
    var activityId=that.data.shopActivities[sASelect].activityId;
    var storageData = my.getStorageSync({ key: 'cookie' });
    if (storageData.data){
      var cookie = storageData.data.cookie;
      if (cookie){
        console.log(2)
        my.showLoading({
          content: '加载中...'
        });
        console.log("shopId：" + shopId)
        var fun=function(){
          my.httpRequest({
            url: globalData.url + '/order/create.jhtm',
            method: 'POST',
            headers: {
              "Connection": "keep-alive",
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
              cookie: cookie,
              shopId: shopId,
              activityId: activityId
            },
            dataType: 'json',
            success: function(res) {
              var data = res.data;

              if (data.error == "0") {

                var _ename = that.data.ename;//店名
                var _price = that.data.shopActivities[sASelect].price;
                var _activityName = that.data.shopActivities[sASelect].activityName;
                var _orderId = data.order.orderId;
                var _longitude = that.data.longitude;
                var _latitude = that.data.latitude;
                my.hideLoading();
                my.navigateTo({ url: '/pages/pay/pay?longitude=' + _longitude + '&latitude=' + _latitude+'&ename=' + _ename + '&orderId=' + _orderId + '&price=' + _price + '&activityName=' + _activityName });

              } else if (data.error == "error") {
                var _fun_num02 = that.data.fun_num02;
                if (_fun_num02>3){
                  my.alert({ content: data.message });
                }else{
                  fun();
                }
                
              } else {
                my.alert({ content: data.message });
              }


            },
            fail: function(res) {
              my.hideLoading();
              console.log(res)
              my.alert({ content: '网络连接失败！' });
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
        
      }else{
        my.navigateTo({ url: '/pages/login/login' });
      }
    }else{
      my.navigateTo({ url: '/pages/login/login' });
    }


    
  },
  bd_decrypt(bd_lng, bd_lat) {//百度坐标转换高德坐标
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return { lng: gg_lng, lat: gg_lat }
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
