Page({
  data:{
    cookie:"",
    isLogin:false,
    isChangeName:false,
    userName:"",
    userTel:"",
    inputValue:"",
    inputValueBool:true
  },
  onLoad(query) {
    // 页面加载
   console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    
    var storageData = my.getStorageSync({ key: 'cookie' });
    if (storageData.data) {
      var cookie = storageData.data.cookie;
      var tel = storageData.data.tel;
      var userName = storageData.data.userName;
      if (cookie) {
        this.setData({
          isLogin: true,
          cookie
        });
      }
      if (tel) {
        this.setData({
          userTel: tel
        });
      }
      if (userName) {
        this.setData({
          userName: userName
        });
      }
    }




  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    var storageData = my.getStorageSync({ key: 'cookie' });
    if (storageData.data) {
      var cookie = storageData.data.cookie;
      var tel = storageData.data.tel;
      if (cookie) {
        this.setData({
          isLogin: true,
          cookie: cookie
        });
      }
      if (tel) {
        this.setData({
          userTel: tel
        });
      }
    }
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
  makePhoneCall(){
   
    my.confirm({
      title: '温馨提示',
      content: '是否拨打电话：4008801768',
      confirmButtonText: '拨打',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.makePhoneCall({ number: '4008801768' })
        }
      },
    });
  },
  loginPage(){

    var _status = this.data.isLogin;
    if (!_status){
      my.navigateTo({ url: '/pages/login/login' });
    }
    

  },
  orderList(){
    var that = this;
    var storageData = my.getStorageSync({ key: 'cookie' });
    if (storageData.data) {
      var cookie = storageData.data.cookie;
      if (cookie) {
        my.navigateTo({ url: '/pages/record/record' });
      } else {
        my.navigateTo({ url: '/pages/login/login' });
      }
    } else {
      my.navigateTo({ url: '/pages/login/login' });
    }
    
  },
  orderListMore(event) {
    var _index = event.target.dataset.index;
    var that = this;
    var storageData = my.getStorageSync({ key: 'cookie' });
    if (storageData.data) {
      var cookie = storageData.data.cookie;
      if (cookie) {
        my.navigateTo({ url: '/pages/record/record?index=' + _index });
      } else {
        my.navigateTo({ url: '/pages/login/login' });
      }
    } else {
      my.navigateTo({ url: '/pages/login/login' });
    }
    
  },
  tapname(){
    this.setData({
      isChangeName: true,
      inputValue: "",
      inputValueBool: false
    });
  },
  changeSure(){
    var _input = this.data.inputValue;
    var _inputValueBool = this.data.inputValueBool;
    if (_inputValueBool){
      this.setData({
        userName: _input,
        isChangeName: false,
        inputValueBool: true
      });
      var cookie = this.data.cookie;
      my.setStorageSync({
        key: 'cookie',
        data: {
          userName: _input,
          cookie: cookie
        }
      });
    }else{
      my.alert({
        title: '提示',
        content: '昵称长度不符合要求！',
        buttonText: '确认',
        success: () => {
          
        },
      });
    }
    
  },
  changeCancel(){
    this.setData({
      isChangeName: false,
      inputValueBool: true,
      inputValue:""
    });
  },
  bindKeyInput(e) {
    console.log(e.detail.value);
    var _val = e.detail.value;
    if (_val.length >= 2 && _val.length<=6){
      this.setData({
        inputValueBool:true,
        inputValue: e.detail.value,
      });
    }else{
      this.setData({
        inputValueBool: false
      });
    }
    
  },
  loginout(){
    my.confirm({
      title: '温馨提示',
      content: '确定退出吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm){
          my.removeStorageSync({
            key: 'cookie',
          });
          this.setData({
            isLogin: false
          });


        }
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
