/**
 * Author: Ismael Gorissen
 * Date: 25/04/13 11:17
 * Company: PinchProject
 */

var debug = require('debug')('inapp'),
    request = require('request');

var _hosts = {
        production: 'buy.itunes.apple.com',
        sandbox: 'sandbox.itunes.apple.com'
    },
    _responseCodes = {
        unknown: {
            message: 'Unknown status code',
            valid: false,
            error: true
        },
        0: {
            message: "Active",
            valid: true,
            error: false
        },
        21000: {
            message: "App store could not read",
            valid: false,
            error: true
        },
        21002: {
            message: "Data was malformed",
            valid: false,
            error: true
        },
        21003: {
            message: "Receipt not authenticated",
            valid: false,
            error: true
        },
        21004: {
            message: "Shared secret does not match",
            valid: false,
            error: true
        },
        21005: {
            message: "Receipt server unavailable",
            valid: false,
            error: true
        },
        21006: {
            message: "Receipt valid but sub expired",
            valid: false,
            error: false
        },
        21007: {
            message: "Sandbox receipt sent to Production environment",
            valid: false,
            error: true,
            redirect: true
        },
        21008: {
            message: "Production receipt sent to Sandbox environment",
            valid: false,
            error: true
        }
    };

function IAPChecker(secret, production) {
    this.secret = secret;
    this.production = production ? production : false;
    this.host = this.production ? _hosts.production : _hosts.sandbox;
}

IAPChecker.prototype = {
    checkAutoRenewReceipt: checkAutoRenewReceipt,
    checkReceipt: checkReceipt,
    setSecret: setSecret
};

function checkAutoRenewReceipt(receipt, done) {
    var data = {
        'receipt-data': '',
        password: this.secret
    };

    checkWithRetry(this, data, receipt, done);
}

function checkReceipt(receipt, done) {
    var data = {
        'receipt-data': ''
    };

    checkWithRetry(this, data, receipt, done);
}

function checkWithRetry(self, receiptData, receipt, done) {
    check(receiptData, receipt, function (err, valid, message, data) {
        if (!err) {
            if ((data.status == 21007) && (self.host === _hosts.production)) {
                self.host = _hosts.sandbox;

                check(receiptData, receipt, function (err, valid, message, data) {
                    done(err, valid, message, data);
                });
            } else {
                done(err, valid, message, data);
            }
        } else {
            done(err);
        }
    });
}

function check(data, receipt, done) {
    var buffer,
        encoded,
        postData;

    buffer = new Buffer(receipt);
    encoded = buffer.toString('base64');

    data['receipt-data'] = encoded;

    postData = JSON.stringify(data);

    request({
        uri: 'https://' + this.host + '/verifyReceipt',
        method: 'POST',
        body: postData,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': postData.length
        }
    }, function (err, res, body) {
        if (!err) {
            try {
                body = JSON.parse(body);

                if (res.statusCode == 200) {
                    processStatus(body, done);
                } else {
                    return done(null, false, body);
                }
            } catch (ex) {
                done(ex);
            }
        } else {
            done(err);
        }
    });
}

function processStatus(data, done) {
    var response;

    if (_responseCodes.hasOwnProperty(data.status)) {
        response = _responseCodes[data.status];
    } else {
        response = _responseCodes.unknown
    }

    done(null, response.valid, response.message, data);
}

function setSecret(secret) {
    this.secret = secret;
}

module.exports = IAPChecker;