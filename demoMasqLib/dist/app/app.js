'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rai = require('random-access-idb');
var hyperdb = require('hyperdb');
var Masq = require('masq-lib');
var data = require('./villeDeFrance.json');

var dbName = 'testDB';
var masq = null;
var channel = 'randomChannel';
var channel2 = 'randomChannel2';
var challenge = 'challenge';
var villes = data.villes;

console.log(Masq);

var debug = function debug(str) {
  if (process.env.NODE_ENV !== 'production') console.log(str);
};

var wait = function wait() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, 100);
  });
};

var isCreated = function isCreated(dbName) {
  return new Promise(function (resolve, reject) {
    var req = indexedDB.open(dbName);
    var existed = true;
    req.onsuccess = function () {
      req.result.close();
      // if (!existed) { indexedDB.deleteDatabase(dbName) }
      resolve(existed);
    };
    req.onupgradeneeded = function () {
      existed = false;
    };
  });
};

/**
 * Return when hyperDb instance is ready
 * @param {Object} db - The hyperDb instance
 */
var dbReady = function dbReady(db) {
  return new Promise(function (resolve, reject) {
    db.on('ready', function () {
      resolve();
    });
  });
};

/**
 * Return the value of a given key
 * @param {Object} db - The hyperdb instance
 * @param {string} key - The key
 * @returns {string|Object} - The value
 */
var get = function get(db, key) {
  return new Promise(function (resolve, reject) {
    db.get(key, function (err, data) {
      if (err) reject(err);
      if (!data[0]) {
        resolve(null);
      } else {
        resolve(data[0].value);
      }
    });
  });
};

/**
 * Set a key to the hyperdb
 * @param {Object} db - The hyperdb instance
 * @param {string} key - The key
 * @param {Object|string} value - The content
 * @returns {int} -The sequence number
 */
var set = function set(db, key, value) {
  return new Promise(function (resolve, reject) {
    db.put(key, value, function (err) {
      if (err) reject(err);
      resolve(value);
    });
  });
};

document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('localTest');
  if (el) {
    el.addEventListener('click', function (e) {
      createLocalHyperDB();
    });
  }
  el = document.getElementById('checkDB');
  if (el) {
    el.addEventListener('click', function (e) {
      checkDB();
    });
  }
  el = document.getElementById('connectMasq');
  if (el) {
    el.addEventListener('click', function (e) {
      connectMasq();
    });
  }
  el = document.getElementById('updateMasqProfiles');
  if (el) {
    el.addEventListener('click', function (e) {
      updateMasqProfiles();
    });
  }
  el = document.getElementById('replicateData');
  if (el) {
    el.addEventListener('click', function (e) {
      replicateData();
    });
  }
  el = document.getElementById('init');
  if (el) {
    el.addEventListener('click', function (e) {
      init();
    });
  }
});

var createLocalHyperDB = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var key, value, db, res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            key = '/hello';
            value = { data: 'world' };
            db = hyperdb(rai(dbName), { valueEncoding: 'json' });
            _context.next = 5;
            return dbReady(db);

          case 5:
            _context.next = 7;
            return set(db, key, value);

          case 7:
            _context.next = 9;
            return get(db, '/hello');

          case 9:
            res = _context.sent;

            console.log(res);
            _context.t0 = console;
            _context.next = 14;
            return isCreated(dbName);

          case 14:
            _context.t1 = _context.sent;
            _context.t2 = 'Database exists : ' + _context.t1;

            _context.t0.log.call(_context.t0, _context.t2);

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createLocalHyperDB() {
    return _ref.apply(this, arguments);
  };
}();

var checkDB = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = console;
            _context2.t1 = dbName + ' exists : ';
            _context2.next = 4;
            return isCreated(dbName);

          case 4:
            _context2.t2 = _context2.sent;
            _context2.t3 = _context2.t1 + _context2.t2;

            _context2.t0.log.call(_context2.t0, _context2.t3);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function checkDB() {
    return _ref2.apply(this, arguments);
  };
}();

var connectMasq = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var el;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            masq = new Masq();
            _context3.next = 3;
            return masq.init();

          case 3:

            // We force channel and challenge for demo purpose

            masq.channel = channel;
            masq.challenge = challenge;
            masq.requestMasqAccess();
            el = document.getElementById('receiveLinkMsgProfiles');

            el.innerHTML = ' Now, please click on receive Link in Masq in order to send the new channel name and the challenge. ';

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function connectMasq() {
    return _ref3.apply(this, arguments);
  };
}();

var updateMasqProfiles = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var profiles, el;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            debug('We get the profiles.');
            _context4.prev = 1;
            _context4.next = 4;
            return masq.getProfiles();

          case 4:
            profiles = _context4.sent;

            if (!profiles) {
              debug('profiles is empty!');
            }
            el = document.getElementById('masqProfilesReplication');

            el.innerHTML = ' Of course your are ' + profiles[0].username + ', your id is  ' + profiles[0].id + ', now click on receive link for data replication and authorization';
            masq.setProfile(profiles[0].id);
            masq.channel = channel2;
            masq.exchangeDataHyperdbKeys();
            _context4.next = 17;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4['catch'](1);

            debug('error in updateMasqProfiles');

            console.log(_context4.t0);

          case 17:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[1, 13]]);
  }));

  return function updateMasqProfiles() {
    return _ref4.apply(this, arguments);
  };
}();

var replicateData = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var el, POI, actualPOI, newPOI;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            el = document.getElementById('addData');
            POI = villes[Math.floor(Math.random() * villes.length)];
            _context5.next = 4;
            return masq.get('/POI');

          case 4:
            actualPOI = _context5.sent;

            if (!actualPOI) {
              actualPOI = [];
            }
            newPOI = [].concat((0, _toConsumableArray3.default)(actualPOI), [POI]);

            el.innerHTML = ' We add a list of POI : ' + JSON.stringify(newPOI) + '. ';

            _context5.next = 10;
            return wait();

          case 10:
            _context5.prev = 10;

            debug('we add a key /POI in data hyperDb');
            _context5.next = 14;
            return masq.put('/POI', newPOI);

          case 14:
            _context5.next = 19;
            break;

          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5['catch'](10);

            console.log(_context5.t0);

          case 19:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[10, 16]]);
  }));

  return function replicateData() {
    return _ref5.apply(this, arguments);
  };
}();

var init = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var profiles;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            masq = new Masq();
            _context6.next = 3;
            return masq.init();

          case 3:
            debug('Must open and sync existing databases');
            _context6.next = 6;
            return masq.getProfiles();

          case 6:
            profiles = _context6.sent;

            debug('sync dones, get profiles : ' + profiles[0].username);
            if (profiles[0]) {
              masq.setProfile(profiles[0].id);
            }

          case 9:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function init() {
    return _ref6.apply(this, arguments);
  };
}();