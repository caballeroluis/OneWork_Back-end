const logGenerator = require('../utils/logGenerator.util');

exports.responseOkArray = (req, res, items) => {
    logGenerator(req);
    return res.status(200).json({
        results: items
    });
}

exports.responseOk = (req, res, item) => {
    logGenerator(req);
    return res.status(200).json({
        result: item
    });
}

exports.responseOkElementDeleted = (req, res) => {
    logGenerator(req);
    return res.status(200).json({});
}

exports.responseOkElementCreated = (req, res, item) => {
    logGenerator(req);
    return res.status(201).json({
        result: item
    });
}

