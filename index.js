

module.exports = function (token) {
	token = token || process.env.ORCHESTRATE_TOKEN;
    if(!token) return console.error('You must specify a token to connect to your Orchestrate Application');

    var db = require('orchestrate')(token);

    db.Model = require('./lib/model')(db);
    db.Collection = require('./lib/collection')(db);

    return db;
};