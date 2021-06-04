import { NextApiHandler } from 'next'
import { bot } from '../../lib/bot'
import { prisma } from '../../lib/prisma'

const debug = require('debug')('api:push')

const handler: NextApiHandler = async (req, res) => {
  const { token, content, type } = req.body

  if (![token, content].every(Boolean)) {
    res.status(422).json('Invalid parameters')
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { token } })

    if (!user) {
      res.status(404).json(`Invalid token: ${token}`)
      return
    }

    const chatId = user.telegramChatId

    await bot.telegram.sendMessage(chatId, content, { parse_mode: type })
    res.status(200).json('Send successfully')
  } catch (err) {
    debug(err)
    res.status(500).end()
  }
}

export default handler
