;(function (root) {
    function CrossStorageClient(url) {
        this._installListener();
        this._hub = this._createFrame(url).contentWindow;
    }

    CrossStorageClient.frameStyle = {
        display: 'none',
        position: 'absolute',
        top: '-999px',
        left: '-999px'
    };

    CrossStorageClient.prototype._installListener = function () {
        window.addEventListener('message', CrossStorageClient._listener, false);
    };

    CrossStorageClient._listener = function (message) {
        /*Security and data checks (origin, nulls, connection etc)*/

        const response = JSON.parse(message.data);
        client._requests[response.id](response.result);
    };

    CrossStorageClient.prototype._createFrame = function (url) {
        const frame = window.document.createElement('iframe');
        frame.id = this._frameId;

        // Style the iframe
        for (const key in CrossStorageClient.frameStyle) {
            if (CrossStorageClient.frameStyle.hasOwnProperty(key)) {
                frame.style[key] = CrossStorageClient.frameStyle[key];
            }
        }

        window.document.body.appendChild(frame);
        frame.src = url;

        return frame;
    };

    CrossStorageClient.prototype._request = function (method, params) {
        let req, client;

        client = this;

        req = {
            id: this._id + ':' + client._count,
            method: 'cross-storage:' + method,
            params: params
        };

        return new this._promise(function (resolve) {
            client._requests[req.id] = function (result) {
                delete client._requests[req.id];
                resolve(result);
            };

            client._hub.postMessage(JSON.stringify(req), targetOrigin); //some origin which will be checked to be the same as src of hub iframe
        });
    };

    CrossStorageClient.prototype.set = function (key, value) {
        return this._request('set', {
            key: key,
            value: value
        });
    };

    CrossStorageClient.prototype.get = function (key) {
        return this._request('get', key);
    };

    CrossStorageClient.prototype.del = function (key) {
        return this._request('del', key);
    };

    CrossStorageClient.prototype.clear = function () {
        return this._request('clear');
    };

    CrossStorageClient.prototype.getKeys = function () {
        return this._request('getKeys');
    };

    /**
     * Exports:
     * module.exports = CrossStorageClient;
     */
}(this));