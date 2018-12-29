var app = getApp();
var globalData = app.globalData;
Page({
  data: {
    status: "",
    price: "",
    ename: "",
    activityName: "",
    createTime: "",
    endTime: "",
    matrixContent: "",
    orderId: "",
    address: "",
    telphone: "",
    position: "",
    longitude:"",
    latitude:"",

    fun_num01:0
  },
  onLoad(query) {
    // 页面加载
    
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    var orderId = query.orderId;
    var longitude = query.longitude;
    var latitude = query.latitude;
    this.setData({
      longitude: longitude,
      latitude: latitude
    });
    this.getData(orderId);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    this.setData({
      fun_num01: 0
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
  daohan() {
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
  getData(orderId) {
    var that = this;
    var storageData = my.getStorageSync({ key: 'cookie' });
    var cookie = storageData.data.cookie;
    my.showLoading({
      content: '加载中...'
    });
    var fun=function(){
      my.httpRequest({
        url: globalData.url + '/order-query.jhtm',
        method: 'POST',
        headers: {
          "Connection": "keep-alive",
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: {
          cookie: cookie,
          orderId: orderId
        },
        dataType: 'json',
        success: function(res) {
          my.hideLoading();
          var data = res.data;
          console.log(data)
          if (data.error == "0") {
            var queryOrder = data.queryOrder;
            // var shopActivities = data.shopActivities;
            var max = queryOrder.matrixContent;
            var matrixContent = max.replace(/\s/g, "");
            that.setData({
              status: queryOrder.status,
              price: queryOrder.price,
              ename: queryOrder.ename,
              activityName: queryOrder.activityName,
              createTime: queryOrder.createTime,
              endTime: queryOrder.endTime,
              matrixContent: matrixContent,
              orderId: queryOrder.orderId,
              address: queryOrder.address,
              telphone: queryOrder.telphone,
              position: queryOrder.position
            });
          } else if (data.error == "error"){
            var _fun_num01 = that.data.fun_num01;
            if (_fun_num01>3){
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
          console.log(res)

        },
        fail: function(res) {
          console.log(res)
          // my.alert({ content: '网络连接失败！' });
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
  daohan() {
    var name = this.data.ename;
    var address = this.data.address;
    var position = this.data.position;

    var _position = this.data.position;
    var latitude = "";
    var longitude = "";
    if (_position) {
      var positionSp = _position.split(",");
      var newLn = this.bd_decrypt(positionSp[0], positionSp[1]);
      latitude = newLn.lat;
      longitude = newLn.lng;
    }


    // my.navigateTo({ url: '/pages/map/map?name=' + name + '&address=' + address + '&latitude=' + latitude + '&longitude=' + longitude});

    my.openLocation({
      longitude: longitude,
      latitude: latitude,
      name: name,
      address: address,
    })
  },
  makePhoneCall(event) {
    var tel = event.target.dataset.tel;
    var newTel = tel.replace(/[^0-9]/ig, "");

    my.confirm({
      title: '温馨提示',
      content: '是否拨打电话：' + tel,
      confirmButtonText: '拨打',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.makePhoneCall({ number: newTel });
        }
      },
    });
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
  backHome(){
    my.switchTab({
      url: '/pages/index/index'
    })
  },
  backRecord(){
    my.navigateTo({ url: '/pages/record/record'});

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
