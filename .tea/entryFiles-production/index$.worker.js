
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/index/index');
require('../../pages/detail/detail');
require('../../pages/record_detail/record_detail');
require('../../pages/pay/pay');
require('../../pages/login/login');
require('../../pages/record/record');
require('../../pages/person/person');
require('../../pages/pay_success/pay_success');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
