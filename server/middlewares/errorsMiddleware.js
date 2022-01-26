
module.exports = function(error, req, res, next) {
    console.log(error);
    return res.status(400)
              .json({
                ok: false,
                error: error.message
            })

}
