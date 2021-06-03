import { NextApiHandler } from 'next'
import { bot } from '../../lib/bot'

const handler: NextApiHandler = async (req, res) => {
  if (req.url !== process.env.SECRET_PATH) {
    res.status(500).end()
    return
  }

  try {
    await bot.handleUpdate(req.body)
  } finally {
    res.status(200).end()
  }
}

export default handler
