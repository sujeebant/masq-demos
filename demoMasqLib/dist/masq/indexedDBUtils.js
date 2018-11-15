"use strict";

module.exports.dbExists = function (dbName) {
  return new Promise(function (resolve, reject) {
    var req = window.indexedDB.open(dbName);
    var existed = true;
    req.onsuccess = function () {
      req.result.close();
      if (!existed) {
        window.indexedDB.deleteDatabase(dbName);
      }
      resolve(existed);
    };
    req.onupgradeneeded = function () {
      existed = false;
    };
    req.onerror = function (err) {
      reject(err);
    };
  });
};