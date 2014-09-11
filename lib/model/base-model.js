
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
            var body = {
                location: res.headers.location
            };

            // Set parse to true so that the location
            // can be normalized to a key and ref for this instance
            options.parse = true;

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

        if(!options.url) {
            options.url = _.result(model, 'url');
        }

        console.log('\n\n' + method);

        switch (method) {
            case 'create': operations.create(model, options); break;
            case 'read': operations.read(model, options); break;
            case 'update': operations.update(model, options); break;
            case 'delete': operations.delete(model, options); break;
        }

    };


    /**
     * Parses the normalized Orchestrate response to extract the 'key' and 'ref'
     */

    function parse(attrs) {
        if(attrs.location) {
            var vals = attrs.location.split('/');

            attrs.key = vals[3];

            delete attrs.location
        }

        return attrs;
    }

    return Model.extend({
        idAttribute: 'key',
        props: {
            key: 'string'
        },
        _db: db,
        sync: sync,
        parse: parse
    });

};