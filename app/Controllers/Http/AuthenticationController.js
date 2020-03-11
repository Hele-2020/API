'use strict'

// eslint-disable-next-line
const Env = use('Env')
const env = Env.get('NODE_ENV', 'development')

// eslint-disable-next-line
const Establishment = use('App/Models/Establishment')

// eslint-disable-next-line
const User = use('App/Models/User')

// eslint-disable-next-line
const { generatePassword, sendSMS } = use('App/Helpers/Authentication')

class AuthenticationController {
  async register({ request, response }) {
    const phone = request.input('phone')

    const code = request.input('establishment_code')
    const establishment = await Establishment.findByOrFail('code', code)

    const password = generatePassword()

    const user = await User.create({
      phone: phone,
      username: request.input('username'),
      establishment_id: establishment.id,
      birthyear: new Date().getFullYear() - request.input('age'),
      password: password
    })

    /* istanbul ignore next */
    if (env === 'production') {
      sendSMS(user.username, user.phone, password)
      return response.status(201).end()
    }
    return response.status(201).json({ user, password })
  }

  async login({ request, auth, response }) {
    let field = null
    let value = null

    if (request.input('phone', false) !== false) {
      field = 'phone'
      value = request.input('phone')
    } else if (request.input('username', false) !== false) {
      field = 'username'
      value = request.input('username')
    } else {
      field = 'email'
      value = request.input('email')
    }

    const user = await User.findByOrFail(field, value)

    try {
      await auth.attempt(user.phone, request.input('password'))
      const accessToken = await auth.withRefreshToken().generate(user)
      return response.status(200).json({ user, accessToken })
    } catch (e) {
      return response.status(400).json({
        status: 400,
        errors: [{ message: 'E_USER_IDENTIFIER_OR_PASSWORD_INCORRECT' }]
      })
    }
  }
}

module.exports = AuthenticationController
