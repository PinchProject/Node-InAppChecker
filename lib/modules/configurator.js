var fs = require('fs'),
    path = require('path');

var CONFIG_FILES_PATH = path.join(__dirname, '..', 'configs');

var cache = {};

exports.load = function (filename) {
    if (!cache[filename]) {
        var filepath = path.join(CONFIG_FILES_PATH, filename + '.json');
        cache[filename] = JSON.parse(fs.readFileSync(filepath, {encoding: 'utf8'}));
        if (!cache[filename])
            throw new Error('Configuration file "' + filename + '" seems to be lacking configuration');
    }
    return cache[filename];
};