'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MasqCore = require('./masq-mock');

var profile = {
  username: 'bob',
  image: 'image1'
};
var appName = 'app1';
var debug = function debug(str) {
  if (process.env.NODE_ENV !== 'production') console.log(str);
};
var channel = 'randomChannel';
var channel2 = 'randomChannel2';

var masqCore = null;

document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('initMasqMock');
  if (el) {
    el.addEventListener('click', function (e) {
      console.log('To disable debug print, remove --mode=development from webpack command in package.json');
      initMasqMock();
    });
  }
  el = document.getElementById('receiveLinkMasqProfiles');
  if (el) {
    el.addEventListener('click', function (e) {
      receiveLinkMasqProfiles();
    });
  }
  el = document.getElementById('receiveLinkSyncData');
  if (el) {
    el.addEventListener('click', function (e) {
      receiveLinkSyncData();
    });
  }
  el = document.getElementById('init');
  if (el) {
    el.addEventListener('click', function (e) {
      init();
    });
  }
});

var initMasqMock = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var profile1, el;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            debug('initMasqMock');

            masqCore = new MasqCore();
            _context.next = 4;
            return masqCore.init();

          case 4:
            _context.next = 6;
            return masqCore.initProfiles();

          case 6:
            _context.next = 8;
            return masqCore.setProfile('bob', profile);

          case 8:
            _context.next = 10;
            return masqCore.getProfile('bob');

          case 10:
            profile1 = _context.sent;

            debug(JSON.stringify(profile1));
            el = document.getElementById('step1');

            el.innerHTML = 'Now, click on Masq Connect in app';

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function initMasqMock() {
    return _ref.apply(this, arguments);
  };
}();

var receiveLinkMasqProfiles = function receiveLinkMasqProfiles() {
  var el = document.getElementById('checkIfProfilesSynced');
  el.innerHTML = ' Sync. of profiles is done, check the app.';
  masqCore.receiveLink({
    type: 'syncProfiles',
    channel: channel,
    challenge: 'challenge'
  });
};

var receiveLinkSyncData = function receiveLinkSyncData() {
  var el = document.getElementById('addDatainApp');
  el.innerHTML = ' Now add data in app, Masq will receive the same data :-)';
  masqCore.receiveLink({
    type: 'syncData',
    channel: channel2,
    challenge: 'challenge',
    appName: appName
  });
  masqCore.on('changePOI', function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(msg) {
      var POI, el;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return masqCore.getItem(appName, '/POI');

            case 2:
              POI = _context2.sent;
              el = document.getElementById('checkDataMsg');

              el.innerHTML = ' We receive: ' + JSON.stringify(POI);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
};

var init = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            masqCore = new MasqCore();
            _context4.next = 3;
            return masqCore._openAndSyncDatabases();

          case 3:
            masqCore.on('changePOI', function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(msg) {
                var POI, el;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return masqCore.getItem(appName, '/POI');

                      case 2:
                        POI = _context3.sent;
                        el = document.getElementById('checkDataMsg');

                        el.innerHTML = ' We receive: ' + JSON.stringify(POI);

                      case 5:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x2) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function init() {
    return _ref3.apply(this, arguments);
  };
}();