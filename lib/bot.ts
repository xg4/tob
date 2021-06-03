import { Telegraf } from 'telegraf'
import { v4 } from 'uuid'
import pkg from '../package.json'
import { prisma } from './prisma'

const debug = require('debug')('lib:bot')

const BOT_TOKEN = process.env.BOT_TOKEN!
const NEXT_URL = process.env.NEXT_URL!
const SECRET_PATH = process.env.SECRET_PATH!

export const bot = new Telegraf(BOT_TOKEN)

bot.command('start', async (ctx) => {
  const telegramChatId = ctx.chat?.id

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

bot.command('token', async (ctx) => {
  const telegramChatId = ctx.chat?.id
  if (!telegramChatId) {
    return
  }
  try {
    const user = await prisma.user.findUnique({
      where: { telegramChatId },
    })

    if (!user) {
      await ctx.reply(
        `You don't have any token \n Use the /start command to generate your token`
      )
      return
    }

    await ctx.reply(`Your current token is: ${user.token}`)
  } catch (err) {
    debug(err)
    await ctx.reply('Internal Server Error \n Please try again')
  }
})

bot.command('revoke', async (ctx) => {
  const telegramChatId = ctx.chat?.id
  if (!telegramChatId) {
    return
  }
  try {
    const user = await prisma.user.findUnique({
      where: { telegramChatId },
    })

    if (!user) {
      await ctx.reply(`You don't have any token`)
      return
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })

    await ctx.reply('Done, revoke successfully')
  } catch (err) {
    debug(err)
    await ctx.reply('Internal Server Error \n Please try again')
  }
})

bot.command('help', (ctx) => ctx.reply(`For more info, see: ${pkg.homepage}`))

const commands = [
  {
    command: 'start',
    description: 'Generate your token',
  },
  {
    command: 'revoke',
    description: 'Destroy your token',
  },
  {
    command: 'token',
    description: 'Show your token',
  },
  {
    command: 'help',
    description: 'Show help information',
  },
]

bot.telegram.setMyCommands(commands)

bot.catch((err) => {
  debug(err)
})

bot.telegram.setWebhook(`${NEXT_URL}${SECRET_PATH}`)
