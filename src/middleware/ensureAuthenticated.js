const { verify } = require('jsonwebtoken')
const authConfig = require("../configs/authConfig")
const AppError = require("../utils/AppError")

function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        throw new AppError("JWT token não inserido");
    }

    const [, token] = authHeader.split(" ")


    try {
        const { sub: user_id } = verify(token, authConfig.jwt.secret)

        request.user = {
            id: Number(user_id),
        }
        return next()

    } catch {
        throw new AppError("JWT token é valido");
    }

}

module.exports = ensureAuthenticated;