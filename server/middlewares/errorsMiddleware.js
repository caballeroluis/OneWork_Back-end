
module.exports = function(error, req, res, next) {
    console.error(error);
    return res.status(error.status || 500)
              .json({
                ok: false,
                message: error.message
            })

}
