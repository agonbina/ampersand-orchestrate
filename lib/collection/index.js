
var Collection = require('ampersand-collection');

module.exports = function (db) {
    var BaseCollection = require('./base-collection')(Collection, db);
    return BaseCollection;
};