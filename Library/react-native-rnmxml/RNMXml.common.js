const xml = require('react-native').NativeModules.RNMXml;

var convertError = (err) => {
    if (err.isOperational && err.cause) {
        err = err.cause;
    }

    var error = new Error(err.description || err.message);
    error.code = err.code;
    throw error;
};

var RNMXml = {
    queryHtml(xmlString, queries) {
        return xml.queryHtml(xmlString, queries)
            .catch(convertError);
    },

    queryXml(xmlString, queries) {
        return xml.queryXml(xmlString, queries)
            .catch(convertError);
    },

    parseString(xmlString, queries) {
        return xml.parseString(xmlString, queries)
            .catch(convertError);
    }
};

module.exports = RNMXml;
