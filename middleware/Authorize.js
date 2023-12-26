const {StatusCodes} = require('http-status-codes')

exports.authorizeRole = (allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({message: "Not Authorized To Access this page" })
    }
    next()
}