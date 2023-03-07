// original crypto.js
self.crypto||(self.crypto={}),crypto.randomUUID||(crypto.getRandomValues?crypto.randomUUID=function(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,function(c){return(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16)})}:crypto.randomUUID=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=16*Math.random()|0;return("x"===c?r:3&r|8).toString(16)})});

// overwrite fetch()
(function () {
  var rFetch = window.fetch;

  var map = {
    '/admin/service/registration/validateDevice': '{"cacheExpirationDays": 3650,"message": "Device Valid","resultCode": "GOOD"}',
    '/admin/service/registration/validate': '{"featId":"","registered":true,"expDate":"2099-01-01","key":""}',
    '/admin/service/registration/getStatus': '{"deviceStatus":"","planType":"","subscriptions":{}}',
  };

  var Resp = function (data) {
    return Promise.resolve({
      status: 200,
      text: function () {
        return data;
      },
      json: function () {
        return JSON.parse(data);
      },
    });
  };

  var fetch = function () {
    var url = arguments[0];
    if (typeof url === 'string') {
      var keys = Object.keys(map);
      for (var i = 0; i < keys.length; i++) {
        var p = keys[i];
        if (url.includes(p)) {
          var data = map[p];
          return Resp(data);
        }
      }
    }

    return rFetch.apply(this, arguments);
  };

  window.fetch = fetch;

})();
