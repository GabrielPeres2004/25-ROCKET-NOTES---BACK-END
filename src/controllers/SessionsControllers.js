const knex = require("../database/knex")
const AppError = require("../utils/AppError")

const { sign } = require("jsonwebtoken")
const { compare } = require('bcryptjs')
const authConfig = require("../configs/authConfig")

class SessionsController {
    async create(request, response) {
        const { email, password } = request.body

        const user = await knex("users").where({ email }).first()

        if (!user) {
            throw new AppError("E-mail ou senha estão incorretos");
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new AppError("E-mail ou senha estão incorretos");
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({ user, token })
    }
}

module.exports = SessionsController;