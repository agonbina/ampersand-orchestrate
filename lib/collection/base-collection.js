
/**
 * Module dependencies
 */

var _ = require('underscore');


var fetchCollection = function(options) {
    var collection  = this;
    var model       = collection.model;
    var db          = collection._db;

    var collName = collection.url ? collection.url : _.result(collection, 'url');

    /*
    TODO: Grab the URL from the model if not specified in the collection
    if(model.url) {
        options.url = model.url;
    } else {
        options.url = _.result(model, 'url');
    }
    */

    // Add all the parsed items to the collection
    function addToCollection(items) {
        _.each(items, function (item) {
            collection.add(item);
        });

        if(options.success) options.success(collection);
    }

    function parseItems(res) {
        var items = res.body.results;
        var result = [];

        items.forEach(function(item) {
            var data = { key: item.path.key };

            _.extend(data, item.value);
            result.push(data);
        });

        return result;
    }

    function onError(err) {
        if(options.error) options.error(err);
    }

    db.list(collName)
        .then(parseItems)
        .then(addToCollection)
        .fail(onError);
};

var createInstance = function () {

};

var fetchByKey = function (key, cb) {
    var collection = this;

    var model = new collection.model({ key: key }, { collection: collection });
    model.fetch({
        success: function () {
            collection.add(model);
            if(cb) cb(null, model);
        },
        error: function (model, err) {
            delete model.collection;
            if(cb) cb(err);
        }
    });

};

module.exports = function (Collection, db) {

    return Collection.extend({
        mainIndex: 'key',
        _db: db,

        fetch: fetchCollection,
        create: createInstance,
        fetchByKey: fetchByKey
    });

};