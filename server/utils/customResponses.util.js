exports.responseOkArray = (res, items) => {
    return res.status(200).json({
        results: items
    });
}

exports.responseOk = (res, item) => {
    return res.status(200).json({
        result: item
    });
}

exports.responseOkElementDeleted = (res) => {
    return res.status(200).json({});
}

exports.responseOkElementCreated = (res, item) => {
    return res.status(201).json({
        result: item
    });
}

