var app = getApp();
var globalData = app.globalData;
Page({
  data: {
    isErbox:true,//正在加载数据
    erbox:"数据加载中...",
    erbox02: "该区域无网点",
    dingwei:"定位中",
    indicatorDots: true,
    autoplay: true,
    interval: 3000,

    onchangeDate:{//选择区县零时保存数据
      select_city: "",
      areaCode: "",
    },
    parameter:{
      cityName:"",
      longitude:"",
      latitude:"",
      pageSize:"10",//一页显示数目
      pageNo:"1",//页码
      areaCode:"",
      activityId:"81",
      sortType:"1"//1距离优先  2价格优先
    },
    select_city: "全市",//选择市区的
    select_service:"小车型",//选择服务
    select_dp:"距离优先",//排序方式
    showPicker: "false",//全市弹窗
    showService: "false",//全部服务弹窗
    showDp: "false",//排序方式弹窗
    isBottom:false,
    isBottomDate: false,//数据是否加载完
    isBottomText: "正在加载数据，请稍等！",
    isBottomNum: 0,
    allCity: [],
    allService: [{ name: "小车型", activityId: "81" }, { name: "全车型", activityId: "5044" }],
    allDp: [{ name: "距离优先", sortType: "1" }, { name: "人气最高", sortType: "2" }],
    items: [],
    isItems:false,//是否有数据

    fun_num01: 0

  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  onLoad(query) {
   
    var that=this;
    // 页面加载
    my.showLoading({
      content: '加载中...'
    });
    my.getLocation({
      type: 1,
      success(res) {
        var str = res.city;

        if (!(str.indexOf("市") > -1)){
          str = str+"市"
        }
        that.setData({
          dingwei: str,
          "parameter.cityName": str,
          latitude: res.latitude,
          longitude: res.longitude
          
        })
        
      },
      fail(res) {
        my.alert({ title: '定位失败' });
      },
      complete(res){
        
        setTimeout(function(){
          that.setData({
            items: [],
            isItems: false,
            "parameter.pageNo": "1",
            "onchangeDate.select_city": "",
            "onchangeDate.areaCode": "",
            isBottom: false,
            isBottomDate: false,//数据是否加载完
            isBottomText: "正在加载数据，请稍等！",
          });
          that.loadData();
        },300)
        
      }
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    var cityName = this.data.parameter.cityName;
    var that=this;
    if (cityName){
      my.showLoading({
        content: '加载中...'
      });
      setTimeout(function() {
        that.setData({
          items: [],
          isItems: false,
          "parameter.pageNo": "1",
          "onchangeDate.select_city": "",
          "onchangeDate.areaCode": "",
          isBottom: false,
          isBottomDate: false,//数据是否加载完
          isBottomText: "正在加载数据，请稍等！",
        });
        that.loadData();
      },300)
      
    }
    this.setData({
      fun_num01: 0
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
    var that = this;
    var _items = this.data.items
    var isBottomDate = this.data.isBottomDate;
    this.setData({
      isBottom: true
    });
    if (!isBottomDate){
      this.loadData();
    }
    
   
  },

//下拉加载洗车网点  
  loadData() {
    // my.getAuthCode({
    //   success: (res) => {

    //     console.log(res)
    //   },
    // });
    var that = this;
   
    var parameter = this.data.parameter;
    this.setData({
      fun_num01: 0
    })
    
    that.setData({
      isErbox: true
    });
    var bd_decrypt = that.bd_decrypt(parameter.longitude, parameter.latitude);
    var fun=function(){
      my.httpRequest({
        url: globalData.url + '/shop/pagingShops.jhtm',
        method: 'POST',
        headers: {
          "Connection": "keep-alive",
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: {
          cityName: parameter.cityName,
          longitude: bd_decrypt.bd_lng,
          latitude: bd_decrypt.bd_lat,
          pageSize: parameter.pageSize,
          pageNo: parameter.pageNo,
          areaCode: parameter.areaCode,
          activityId: parameter.activityId,
          sortType: parameter.sortType
        },
        dataType: 'json',
        success: function(res) {
          my.hideLoading();
          var data = res.data;
          var _pageNo = that.data.parameter.pageNo;
          if (data.error == "0") {

            var _shops = data.shops;
            if (_shops.length < parameter.pageSize) {
              that.setData({
                isBottomText: "数据加载完毕",
                isBottomDate: true
              });
            }
            if (_shops.length > 0) {
              setTimeout(function() {
                that.setData({
                  isBottom: true,
                  isItems: true
                });
              }, 500)

            }
            var items = that.data.items;

            _shops.map(function(item) {
              var _str = item.distance;
              var number = parseFloat(_str);

              item.distance = number.toFixed(2);

              items.push(item);
            });
            _pageNo++;
            if (data.addresses) {
              that.setData({
                allCity: data.addresses,
                items: items,
                "parameter.pageNo": _pageNo
              });
            }

          } else if (data.error == "error") {
            var _fun_num01 = that.data.fun_num01;
            if (_fun_num01>3){
              my.alert({ content: data.message });
            }else{
              my.showLoading({
                content: '加载中...'
              });
              fun();
            }
            
          } else {
            my.alert({ content: data.message });
          }

        },
        fail: function(res) {
          my.hideLoading();
          my.alert({ content: '网络连接失败！' });
        },
        complete: function(res) {
          var _fun_num01 = that.data.fun_num01;
          var _val = _fun_num01+1;
          setTimeout(function() {
            that.setData({
              isErbox: false,
              fun_num01:_val
            });
          }, 1000)

          
        }
      });
    }
    fun();
  },
  allCity() {//所有城市
    var _bool="true";
    if (this.data.showPicker=="true"){
      _bool="false";
    }
    this.setData({
      showPicker: _bool,
      showService: "false",
      showDp: "false",
    });
  },
  
  onChange(e) {//全市地区选择
    var allCity = this.data.allCity;
    var _select_city="全市";
    var _areaCode = "";
    var _value = e.detail.value;
    if (_value!=0){
      _select_city = allCity[_value-1].value;
      _areaCode = allCity[_value - 1].code;
    }


    this.setData({
      "onchangeDate.select_city": _select_city,
      "onchangeDate.areaCode": _areaCode
     
    });
    
  },
  ok(res) {
   var that=this;
    var _select_city = that.data.onchangeDate.select_city;
    var _areaCode = that.data.onchangeDate.areaCode;
    my.showLoading({
      content: '加载中...'
    });
    if (_select_city && _areaCode){
      this.setData({
        select_city: _select_city,
        "parameter.areaCode": _areaCode,
        items: [],
        isItems:false,
        "parameter.pageNo": "1",
        "onchangeDate.select_city": "",
        "onchangeDate.areaCode": "",
        showPicker: "false",
        isBottom: false,
        isBottomDate: false,//数据是否加载完
        isBottomText: "正在加载数据，请稍等！",
      });
      
    }else{
      this.setData({
        select_city: "全市",
        "parameter.areaCode": "",
        items: [],
        isItems:false,
        "parameter.pageNo": "1",
        "onchangeDate.select_city": "",
        "onchangeDate.areaCode": "",
        showPicker: "false",
        isBottom: false,
        isBottomDate: false,//数据是否加载完
        isBottomText: "正在加载数据，请稍等！",
      });
      
    }
    
    that.loadData();
   
  },
  cancel() {

    this.setData({
      showPicker: "false",
    });
  },
  handleMap(event) {//跳转页面
    var hi = JSON.stringify(event.target.dataset.hi);

    my.navigateTo({ url: '/pages/detail/detail?hi=' + hi });
  },
  allService() {//所有服务
    var _bool = "true";
    if (this.data.showService == "true") {
      _bool = "false";
    }
    this.setData({
      showService: _bool,
      showPicker: "false",
      showDp: "false",
    });
  },
  allSTap(event) {
    var that=this;
    var id = event.target.dataset.id;
    var activityId = event.target.dataset.activityId;
    this.setData({
      "parameter.activityId": activityId,
      select_service: id,
      showService: "false",
      items: [],
      isItems:false,
      "parameter.pageNo": "1",
      isBottom: false,
      isBottomDate: false,//数据是否加载完
      isBottomText: "正在加载数据，请稍等！",
    });
    // 页面加载
    my.showLoading({
      content: '加载中...'
    });
    that.loadData();
  },
  close_tompBg(){
    this.setData({
      showService: "false",
    });
  },
  allDp() {//排序
    var _bool = "true";
    if (this.data.showDp == "true") {
      _bool = "false";
    }
    this.setData({
      showDp: _bool,
      showService: "false",
      showPicker: "false",
    });
  },
  allDpTap(event){
    var that=this;
    var id = event.target.dataset.id;
    var sortType = event.target.dataset.sortType;
    this.setData({
      "parameter.sortType": sortType,
      select_dp: id,
      showDp: "false",
      items: [],
      isItems:false,
      "parameter.pageNo": "1",
      isBottom: false,
      isBottomDate: false,//数据是否加载完
      isBottomText: "正在加载数据，请稍等！",
    });
    // 页面加载
    my.showLoading({
      content: '加载中...'
    });
    that.loadData();
  },
  close_DpBg(){
    this.setData({
      showDp: "false",
    });
  },
  chooseCity() {
    var that=this;
    my.chooseCity({
      showLocatedCity: true,
      showHotCities: true,
      success: (res) => {
        var str = res.city;
        if (!(str.indexOf("市") > -1 || str.indexOf("澳门") > -1 || str.indexOf("香港") > -1 || str.indexOf("自治县") > -1 || str.indexOf("自治州") > -1)) {
          str = str + "市"
        }
        // my.showLoading({
        //   content: '加载中...'
        // });
        
        that.setData({
          dingwei: str,
          "parameter.cityName": str,
          items: [],
          isBottom: false,
          isBottomDate: false,//数据是否加载完
          isBottomText: "正在加载数据，请稍等！",

          isItems: false,
          "parameter.pageNo": "1",

          select_city: "全市",
          "parameter.areaCode": "",
        });
        // that.loadData();
          
        


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
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '盛大养车',
      desc: '最优质的服务',
      path: 'pages/index/index',
    };
  }
});
