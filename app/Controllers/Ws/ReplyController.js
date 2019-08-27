'use strict'

class ReplyController {
  constructor({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.auth = auth
  }

  async onMessage(message) {
    try {
      if (message.length === 0 || /^\s*$/.test(message)) { return }
      const user = await this.auth.getUser()
      const postId = await Database
        .table('replies')
        .insert({ user_id: user.id , post_id: message.id, content: message.message })
    } catch (err) {
      console.error('erreur', err)
    }
    this.socket.broadcastToAll('send', {
      user: 'user',
      message: message,
      date: ''
    })
  }
}

module.exports = ReplyController
