

module.exports = function (token) {
    if(!token) return console.error('You must specify a token to connect to your Orchestrate Application');

    var db = require('orchestrate')(token);

    var BaseModel = require('./lib/model')(db);
    var BaseCollection = require('./lib/collection')(db);

    db.Model = BaseModel;
    db.Collection = BaseCollection;

    return db;
};