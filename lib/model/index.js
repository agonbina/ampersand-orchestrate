
var Model = require('ampersand-model');

module.exports = function (db) {
    var BaseModel = require('./base-model')(Model, db);
    return BaseModel;
};