const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.")
    }

    if (password.length < 8) {
      throw new AppError("A senha deve ter no minimo 8 caracteres");
    }

    const hashedPassword = await hash(password, 8)

    try {

      await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      )

      return response.status(201).json()

    } catch {
      throw new AppError("Não foi possivel cadastrar");
    }


  }

  async update(request, response) {
    const { name, email, password, oldPassword } = request.body
    const user_id = request.user.id

    const database = await sqliteConnection()

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

    if (!user) {
      throw new AppError("Usuário não encontrado.")
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("E-mail ja está em uso.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !oldPassword) {
      throw new AppError("Digite a senha antiga.")
    }

    if (!password && oldPassword) {
      throw new AppError("Digite a senha nova.")
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password)

      if (!checkOldPassword) {
        throw new AppError("Senha antiga inválida")
      }

      user.password = await hash(password, 8)

    }

    await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )

    return response.json()

  }
}

module.exports = UsersController
