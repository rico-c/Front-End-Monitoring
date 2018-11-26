'use strict';

const superagent = require('superagent');

module.exports = function() {
  return new Promise(resolve => {
    // try to visit a private png file
    superagent.get('https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/rmsportal/FlPJSPwhzfagtBoHKCbu.png')
      .timeout(2000)
      .end(err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
  });
};