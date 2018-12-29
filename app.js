App({
  globalData:{
    url: "https://sd.ssdlqcfw.com/ALIPAYAPP",
    url_sms:"https://sd.auto1768.com/ShengDaSMS/sms/getRandomVCode.jhtm"
  },
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
