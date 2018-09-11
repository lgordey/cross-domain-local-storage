;(function () {
    let CrossStorageHub = {};

    CrossStorageHub.init = function (permissions) {
        CrossStorageHub._permissions = permissions || [];
        CrossStorageHub._installListener();
        window.parent.postMessage('cross-storage:ready', '*');
    };

    CrossStorageHub._installListener = function () {
        window.addEventListener('message', CrossStorageHub._listener, false);
    };

    CrossStorageHub._listener = function (message) {
        /*
        * Error handling, null checks, permission checks for origin etc
        * */

        const request = JSON.parse(message.data);
        const method = request.method.split('cross-storage:')[1];
        const result = CrossStorageHub['_' + method](request.params);
        const response = JSON.stringify({
            id: request.id,
            result: result
        });

        window.parent.postMessage(response, message.origin);
    };

    CrossStorageHub._set = function (params) {
        window.localStorage.setItem(params.key, params.value);
    };

    CrossStorageHub._get = function (params) {
        return window.localStorage.getItem(params.key);
    };

    CrossStorageHub._del = function (params) {
        window.localStorage.removeItem(params.key);
    };

    CrossStorageHub._clear = function () {
        window.localStorage.clear();
    };

    CrossStorageHub._getKeys = function () {
        const keys = [];
        const length = window.localStorage.length;

        for (let i = 0; i < length; i++) {
            keys.push(window.localStorage.key(i));
        }

        return keys;
    };

    /**
     * Exports:
     * module.exports = CrossStorageHub;
     */
}(this));