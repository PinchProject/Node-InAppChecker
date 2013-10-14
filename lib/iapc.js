/**
 * Author: Ismael Gorissen
 * Company: PinchProject
 */

var request = require('request'),
    debug = require('debug')('IAPC');
var Configurator = require('./modules/configurator');

var HOSTS = Configurator.load('hosts');
var RESPONSE_CODES_MESSAGE = Configurator.load('response_codes_message');

/**
 *
 * @param password
 * @param production
 * @constructor
 */
function IAPChecker(password, production) {
    this.password = password;
    this.production = production ? true : false;
    this.host = this.production ? HOSTS.production : HOSTS.sandbox;
}

/**
 *
 * @param password
 */
IAPChecker.prototype.setPassword = function (password) {
    this.password = password;
};

/**
 *
 * @param receipt
 * @param callback
 */
IAPChecker.prototype.checkAutoRenewReceipt = function (receipt, callback) {
    var self = this;

    var data = {
        'receipt-data': self._encodeReceiptInBase64(receipt),
        password: self.password
    };

    self._check(data, callback);
};

/**
 *
 * @param receipt
 * @param callback
 */
IAPChecker.prototype.checkReceipt = function (receipt, callback) {
    var self = this;

    var data = {
        'receipt-data': self._encodeReceiptInBase64(receipt)
    };

    self._check(data, callback);
};

/**
 *
 * @param receiptData
 * @param callback
 * @private
 */
IAPChecker.prototype._check = function (receiptData, callback) {
    var self = this;

    var body = JSON.stringify(receiptData);
    var options = {
        uri: self._hostUri(),
        method: 'POST',
        body: body,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': body.length
        },
        timeout: 10000
    };

    self._post(
        options,
        function (err, data) {
            if (err) return callback(err);

            if (data.status == 0)
                return callback(null, data);
            if (data.status != 21007 && data.status != 21008)
                return callback(new Error(RESPONSE_CODES_MESSAGE['' + data.status + '']));

            if (data.status == 21007)
                self.host = HOSTS.sandbox;
            if (data.status == 21008)
                self.host = HOSTS.production;

            self._check(receiptData, callback);
        }
    );
};

/**
 *
 * @param options
 * @param callback
 * @private
 */
IAPChecker.prototype._post = function (options, callback) {
    request(
        options,
        function (err, response, body) {
            if (err) return callback(err);

            try {
                body = JSON.parse(body);

                if (response.statusCode == 200) {
                    callback(null, body);
                } else {
                    err = new Error('Expected HTTP status code "200", got "' + response.statusCode + '"');
                    err.body = body;
                    callback(err);
                }
            } catch (ex) {
                return callback(new Error('Response body can not be parsed'));
            }
        }
    )
};

/**
 *
 * @returns {string}
 * @private
 */
IAPChecker.prototype._hostUri = function () {
    return 'https://' + this.host + '/verifyReceipt';
};

/**
 *
 * @param receipt
 * @returns {*|String}
 * @private
 */
IAPChecker.prototype._encodeReceiptInBase64 = function (receipt) {
    return new Buffer(receipt).toString('base64');
};

module.exports = IAPChecker;