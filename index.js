
/**
 * Module dependencies
 */

var Model = require('ampersand-model');
var Collection = require('ampersand-collection');

module.exports = function (token) {
    if(!token) return console.error('You must specify a token to connect to your Orchestrate Application');

    var db = require('orchestrate')(token);

    // Extend Model to have a property 'key' as the idAttribute
    var BaseModel = require('./lib/model/base-model')(Model, db);

    BaseModel.Event = require('./lib/model/event')(BaseModel);

    db.Model = BaseModel;

    return db;
};