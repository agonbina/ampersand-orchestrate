
/**
 * Module dependencies
 */

var _ = require('underscore');


/**
 * CRUD operations used by sync
 */

var operations = {
    create: function (model, options) {
        var db      = model._db;
        var data    = model.toJSON();

        function onCreated(res) {
            var location = res.headers.location.split('/');
            var body = {
                key: location[3]
            };

            options.success(body);
        }

        function onError(err) {
            options.error(err, 'error');
        }

        db.post(options.url, data).then(onCreated).fail(onError);
    },

    read: function (model, options) {
        var db  = model._db;
        var key = model.key;

        function onRetrieved(res) {
            options.success(res.body);
        }

        function onError(err) {
            options.error(err);
        }

        db.get(options.url, key).then(onRetrieved).fail(onError);
    },

    update: function (model, options) {
        var db      = model._db;
        var key     = model.key;
        var data    = model.toJSON();

        function onUpdated(res) {
            options.success(data);
        }

        function onError(err) {
            options.error(err);
        }

        db.put(options.url, key, data).then(onUpdated).fail(onError);
    },

    delete: function (model, options) {
        var db      = model._db;
        var key     = model.key;

        function onDeleted(result) {
            options.success(result.statusCode);
        }

        function onError(err) {
            options.error(err);
        }

        db.remove(options.url, key, true).then(onDeleted).fail(onError);
    }
};


module.exports = function (Model, db) {

    /**
     * Default Model sync implementation stored as items in an Orchestrate collection
     *
     * @param method
     * @param model
     * @param options
     */

    var sync = function (method, model, options) {

        // Default success and error callbacks that do nothing
        function noop() {}

        _.defaults(options || (options = {}),{
            success: noop,
            error: noop
        });

        // TODO: Error if a url is not specified
        if(!options.url) {
            options.url = _.result(model, 'url');
        }

        switch (method) {
            case 'create': operations.create(model, options); break;
            case 'read': operations.read(model, options); break;
            case 'update': operations.update(model, options); break;
            case 'delete': operations.delete(model, options); break;
        }

    };

    return Model.extend({
        idAttribute: 'key',
        props: {
            key: 'string'
        },
        _db: db,
        sync: sync
    });

};