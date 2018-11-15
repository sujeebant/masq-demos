'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swarm = require('webrtc-swarm');
var signalhub = require('signalhubws');
var rai = require('random-access-idb');
var hyperdb = require('hyperdb');
var uuidv4 = require('uuid/v4');
var pump = require('pump');
var EventEmitter = require('events');
var dbExists = require('./indexedDBUtils').dbExists;

var HUB_URL = 'localhost:8080';
var debug = function debug(str) {
  if (process.env.NODE_ENV !== 'production') console.log(str);
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

var MasqMock = function (_EventEmitter) {
  (0, _inherits3.default)(MasqMock, _EventEmitter);

  /**
   * constructor
   */
  function MasqMock() {
    (0, _classCallCheck3.default)(this, MasqMock);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MasqMock.__proto__ || Object.getPrototypeOf(MasqMock)).call(this));

    _this.currentProfile = null;
    _this.currentId = null;
    _this.localKey = null;
    _this.sws = {};
    _this.hubs = {};
    _this.channels = null;
    _this.challenge = null;
    _this.peer = null;
    _this.peers = {};
    _this.masqProfiles = null;
    _this.dbs = {
      masqProfiles: null // masq public profiles
    };
    return _this;
  }

  (0, _createClass3.default)(MasqMock, [{
    key: 'init',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.initProfiles();

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'initProfiles',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var _this2 = this;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                  _this2.masqProfiles = hyperdb(rai('masq-profiles'), { valueEncoding: 'json' });
                  _this2.masqProfiles.on('ready', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                    var profiles;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _this2.get(_this2.masqProfiles, '/profiles');

                          case 2:
                            profiles = _context2.sent;

                            if (profiles) {
                              _context2.next = 12;
                              break;
                            }

                            _context2.prev = 4;
                            _context2.next = 7;
                            return _this2.set(_this2.masqProfiles, '/profiles', []);

                          case 7:
                            _context2.next = 12;
                            break;

                          case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2['catch'](4);

                            console.log(_context2.t0);

                          case 12:
                            resolve();

                          case 13:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this2, [[4, 9]]);
                  })));
                }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function initProfiles() {
        return _ref2.apply(this, arguments);
      }

      return initProfiles;
    }()
  }, {
    key: 'createAppDb',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(name) {
        var _this3 = this;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                debug('I create hyperDB with this name :', name);

                return _context5.abrupt('return', new Promise(function (resolve, reject) {
                  _this3.dbs[name] = hyperdb(rai(name), { valueEncoding: 'json' });
                  _this3.dbs[name].on('ready', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            resolve(_this3.dbs[name].key);

                          case 1:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this3);
                  })));
                }));

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function createAppDb(_x) {
        return _ref4.apply(this, arguments);
      }

      return createAppDb;
    }()

    /**
    * Return the value of a given key
    * @param {Object} db - The hyperdb instance
    * @param {string} key - The key
    * @returns {string|Object} - The value
    */

  }, {
    key: 'get',
    value: function get(db, key) {
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
    }

    /**
    * Return the value of a given key for a specific db
    * @param {string} dbName - The hyperdb instance name
    * @param {string} key - The key
    * @returns {string|Object} - The value
    */

  }, {
    key: 'getItem',
    value: function getItem(dbName, key) {
      var db = this.dbs[dbName];
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
    }

    /**
     * Set a key to the hyperdb
     * @param {Object} db - The hyperdb instance
     * @param {string} key - The key
     * @param {Object|string} value - The content
     * @returns {int} -The sequence number
     */

  }, {
    key: 'set',
    value: function set(db, key, value) {
      return new Promise(function (resolve, reject) {
        db.put(key, value, function (err) {
          if (err) reject(err);
          resolve(value);
        });
      });
    }

    /**
    * Add a write permission to the db
    * @param {Object} db - The hyperdb instance
    * @param {Buffer} key - The key we will give the write permission
    */

  }, {
    key: 'authorize',
    value: function authorize(db, key) {
      return new Promise(function (resolve, reject) {
        db.authorize(key, function (err) {
          if (err) reject(err);
          resolve();
        });
      });
    }

    /**
    * Check if the other hyperdb instance is authorized to write
    * @param {Object} dbname - The hyperdb instance name
    * @param {Buffer} key - The authorized hyperdb local key
    */

  }, {
    key: 'isAuthorized',
    value: function isAuthorized(dbname) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (!_this4.localKey) console.log('the local key is not stored in MasqMock');
        _this4.dbs[dbname].authorized(_this4.localKey, function (err, auth) {
          if (err) reject(err);else if (auth === true) resolve(true);else resolve(false);
        });
      });
    }
  }, {
    key: 'getProfilesIds',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', this.get(this.masqProfiles, '/profiles'));

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getProfilesIds() {
        return _ref6.apply(this, arguments);
      }

      return getProfilesIds;
    }()
  }, {
    key: 'getProfiles',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var _this5 = this;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt('return', new Promise(function () {
                  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(resolve, reject) {
                    var ids, promiseArr, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id;

                    return _regenerator2.default.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            _context7.next = 2;
                            return _this5.getProfilesIds();

                          case 2:
                            ids = _context7.sent;
                            promiseArr = [];
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context7.prev = 7;

                            for (_iterator = ids[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                              id = _step.value;

                              promiseArr.push(_this5.get(_this5.masqProfiles, '/profiles/' + id));
                            }
                            _context7.next = 15;
                            break;

                          case 11:
                            _context7.prev = 11;
                            _context7.t0 = _context7['catch'](7);
                            _didIteratorError = true;
                            _iteratorError = _context7.t0;

                          case 15:
                            _context7.prev = 15;
                            _context7.prev = 16;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                              _iterator.return();
                            }

                          case 18:
                            _context7.prev = 18;

                            if (!_didIteratorError) {
                              _context7.next = 21;
                              break;
                            }

                            throw _iteratorError;

                          case 21:
                            return _context7.finish(18);

                          case 22:
                            return _context7.finish(15);

                          case 23:
                            return _context7.abrupt('return', resolve(Promise.all(promiseArr)));

                          case 24:
                          case 'end':
                            return _context7.stop();
                        }
                      }
                    }, _callee7, _this5, [[7, 11, 15, 23], [16,, 18, 22]]);
                  }));

                  return function (_x2, _x3) {
                    return _ref8.apply(this, arguments);
                  };
                }()));

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getProfiles() {
        return _ref7.apply(this, arguments);
      }

      return getProfiles;
    }()
  }, {
    key: 'setProfilesIds',
    value: function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(ids) {
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.set(this.masqProfiles, '/profiles', ids);

              case 2:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function setProfilesIds(_x4) {
        return _ref9.apply(this, arguments);
      }

      return setProfilesIds;
    }()
  }, {
    key: 'setProfile',
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(username, profile) {
        var id, withId, ids;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                id = uuidv4();
                withId = {
                  username: profile.username,
                  image: profile.image,
                  id: id
                };
                _context10.next = 4;
                return this.getProfilesIds();

              case 4:
                ids = _context10.sent;
                _context10.next = 7;
                return this.setProfilesIds([].concat((0, _toConsumableArray3.default)(ids), [id]));

              case 7:
                _context10.next = 9;
                return this.set(this.masqProfiles, '/profiles/' + id, withId);

              case 9:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function setProfile(_x5, _x6) {
        return _ref10.apply(this, arguments);
      }

      return setProfile;
    }()
  }, {
    key: 'getProfile',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(username) {
        var id, profile;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.getId(username);

              case 2:
                id = _context11.sent;

                if (!id) {
                  _context11.next = 9;
                  break;
                }

                _context11.next = 6;
                return this.get(this.masqProfiles, '/profiles/' + id);

              case 6:
                _context11.t0 = _context11.sent;
                _context11.next = 10;
                break;

              case 9:
                _context11.t0 = null;

              case 10:
                profile = _context11.t0;
                return _context11.abrupt('return', profile);

              case 12:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getProfile(_x7) {
        return _ref11.apply(this, arguments);
      }

      return getProfile;
    }()
  }, {
    key: 'getId',
    value: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(username) {
        var listProfiles, profile;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.getProfiles();

              case 2:
                listProfiles = _context12.sent;
                profile = listProfiles.filter(function (p) {
                  return p.username === username;
                });
                return _context12.abrupt('return', profile[0].id);

              case 5:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getId(_x8) {
        return _ref12.apply(this, arguments);
      }

      return getId;
    }()
  }, {
    key: 'receiveLink',
    value: function receiveLink(info) {
      switch (info.type) {
        case 'syncProfiles':
          debug('Link for syncProfiles contains: ' + info.channel + ' ' + info.challenge);
          this.exchangeProfilesKey(info.channel, info.challenge);
          break;
        case 'syncData':
          debug('Link for syncData contains: ' + info.channel + ' ' + info.challenge + ' ' + info.appName);
          this.exchangeDataHyperdbKeys(info.channel, info.challenge, info.appName);

          break;

        default:
          break;
      }
    }
  }, {
    key: 'exchangeProfilesKey',
    value: function () {
      var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(channel, challenge) {
        var _this6 = this;

        var initalMessage, _handleData;

        return _regenerator2.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                initalMessage = JSON.stringify({
                  msg: 'sendProfilesKey',
                  challenge: challenge,
                  key: this.masqProfiles.key.toString('hex')
                });

                _handleData = function () {
                  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(sw, peer, data) {
                    var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
                    var json;
                    return _regenerator2.default.wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            json = JSON.parse(data);
                            _context13.t0 = json.msg;
                            _context13.next = _context13.t0 === 'replicationProfilesStarted' ? 4 : 6;
                            break;

                          case 4:
                            _this6._startReplication(_this6.masqProfiles, 'profiles');
                            return _context13.abrupt('break', 8);

                          case 6:
                            console.log('The message type is false.');
                            return _context13.abrupt('break', 8);

                          case 8:
                          case 'end':
                            return _context13.stop();
                        }
                      }
                    }, _callee13, _this6);
                  }));

                  return function _handleData(_x12, _x13, _x14) {
                    return _ref14.apply(this, arguments);
                  };
                }();

                this._initSwarmWithDataHandler(channel, _handleData, initalMessage);

              case 3:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function exchangeProfilesKey(_x9, _x10) {
        return _ref13.apply(this, arguments);
      }

      return exchangeProfilesKey;
    }()
  }, {
    key: '_initSwarmWithDataHandler',
    value: function _initSwarmWithDataHandler(channel, dataHandler, initalMessage) {
      // Subscribe to channel for a limited time to sync with masq
      debug('I create a hub with the channel ' + channel);
      var hub = signalhub(channel, [HUB_URL]);
      var sw = null;

      if (swarm.WEBRTC_SUPPORT) {
        sw = swarm(hub);
      } else {
        sw = swarm(hub, { wrtc: require('wrtc') });
      }

      sw.on('peer', function (peer, id) {
        debug('a peer join us...');
        if (initalMessage) {
          peer.send(initalMessage);
        }
        peer.on('data', function (data) {
          return dataHandler(sw, peer, data);
        });
      });

      sw.on('close', function () {
        hub.close();
      });

      sw.on('disconnect', function (peer, id) {
        sw.close();
      });
    }
  }, {
    key: 'exchangeDataHyperdbKeys',
    value: function () {
      var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(channel, challenge, name) {
        var _this7 = this;

        var key, initalMessage, _handleData;

        return _regenerator2.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.createAppDb(name);

              case 2:
                key = _context16.sent;
                initalMessage = JSON.stringify({
                  msg: 'sendDataKey',
                  challenge: challenge,
                  key: key.toString('hex')
                });

                _handleData = function () {
                  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(sw, peer, data) {
                    var json;
                    return _regenerator2.default.wrap(function _callee15$(_context15) {
                      while (1) {
                        switch (_context15.prev = _context15.next) {
                          case 0:
                            json = JSON.parse(data);
                            _context15.t0 = json.msg;
                            _context15.next = _context15.t0 === 'requestWriteAccess' ? 4 : 11;
                            break;

                          case 4:
                            // store local key for authorized test
                            _this7.localKey = Buffer.from(json.key, 'hex');
                            _context15.next = 7;
                            return _this7.authorize(_this7.dbs[name], Buffer.from(json.key, 'hex'));

                          case 7:
                            debug('name : ' + name);
                            _this7._startReplication(_this7.dbs[name], name);
                            peer.send(JSON.stringify({
                              msg: 'ready'
                            }));
                            return _context15.abrupt('break', 13);

                          case 11:
                            console.log('The message type is false.');
                            return _context15.abrupt('break', 13);

                          case 13:
                          case 'end':
                            return _context15.stop();
                        }
                      }
                    }, _callee15, _this7);
                  }));

                  return function _handleData(_x18, _x19, _x20) {
                    return _ref16.apply(this, arguments);
                  };
                }();

                this._initSwarmWithDataHandler(channel, _handleData, initalMessage);

              case 6:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function exchangeDataHyperdbKeys(_x15, _x16, _x17) {
        return _ref15.apply(this, arguments);
      }

      return exchangeDataHyperdbKeys;
    }()
  }, {
    key: '_startReplication',
    value: function _startReplication(db, name) {
      var _this8 = this;

      debug('Start replication for ' + name);
      var discoveryKey = db.discoveryKey.toString('hex');
      this.hubs[name] = signalhub(discoveryKey, [HUB_URL]);
      var hub = this.hubs[name];

      if (swarm.WEBRTC_SUPPORT) {
        this.sws[name] = swarm(hub);
      } else {
        this.sws[name] = swarm(hub, { wrtc: require('wrtc') });
      }
      var sw = this.sws[name];

      sw.on('peer', function () {
        var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(peer, id) {
          var stream;
          return _regenerator2.default.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  stream = db.replicate({ live: true });

                  pump(peer, stream, peer);

                case 2:
                case 'end':
                  return _context17.stop();
              }
            }
          }, _callee17, _this8);
        }));

        return function (_x21, _x22) {
          return _ref17.apply(this, arguments);
        };
      }());
      if (name === 'app1') {
        debug('set watchers for POI');
        db.watch('/POI', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
          return _regenerator2.default.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _this8.emit('changePOI', { db: name, key: '/POI' });

                case 1:
                case 'end':
                  return _context18.stop();
              }
            }
          }, _callee18, _this8);
        })));
      }
      sw.on('close', function (msg) {
        debug('startReplication close for ' + name);
        hub.close();
      });

      sw.on('disconnect', function (peer, id) {
        debug('startReplication disconnect for ' + name);
        sw.close();
        hub.close();
      });
    }
    /** open and sync existing databases */

  }, {
    key: '_openAndSyncDatabases',
    value: function () {
      var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
        var db, name, db2;
        return _regenerator2.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return dbExists('masq-profiles');

              case 2:
                if (_context19.sent) {
                  _context19.next = 4;
                  break;
                }

                return _context19.abrupt('return');

              case 4:
                db = hyperdb(rai('masq-profiles'), { valueEncoding: 'json' });
                _context19.next = 7;
                return dbReady(db);

              case 7:
                this.dbs.profiles = db;
                this._startReplication(db, 'profiles');

                name = 'app1';
                _context19.next = 12;
                return dbExists(name);

              case 12:
                if (_context19.sent) {
                  _context19.next = 14;
                  break;
                }

                return _context19.abrupt('return');

              case 14:
                db2 = hyperdb(rai(name), { valueEncoding: 'json' });
                _context19.next = 17;
                return dbReady(db2);

              case 17:
                this.dbs[name] = db2;
                this._startReplication(db2, name);

              case 19:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function _openAndSyncDatabases() {
        return _ref19.apply(this, arguments);
      }

      return _openAndSyncDatabases;
    }()
  }]);
  return MasqMock;
}(EventEmitter);

module.exports = MasqMock;