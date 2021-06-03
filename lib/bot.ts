import { PrismaClient } from '@prisma/client'
import { Telegraf } from 'telegraf'
import { v4 } from 'uuid'

const debug = require('debug')('lib:bot')

const BOT_TOKEN = process.env.BOT_TOKEN!
const NEXT_URL = process.env.NEXT_URL!
const SECRET_PATH = process.env.SECRET_PATH!

export const bot = new Telegraf(BOT_TOKEN)

bot.command('start', async (ctx) => {
  const telegramChatId = ctx.chat?.id

  const prisma = new PrismaClient()

  if (!telegramChatId) {
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { telegramChatId } })
    if (user) {
      await ctx.reply(`Welcome to telegram bot, your token is ${user.token}`)
      return
    }

    // generate new token
    const token = v4()
    await prisma.user.create({
      data: {
        telegramChatId,
        token,
      },
    })

    await ctx.reply(`Welcome to telegram bot, your token is ${token}`)
  } catch (err) {
    debug(err)
    await ctx.reply('Internal Server Error \n Please try again')
  }
})

bot.command('image', (ctx) =>
  ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' })
)

bot.telegram.setWebhook(`${NEXT_URL}${SECRET_PATH}`)
