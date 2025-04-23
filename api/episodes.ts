import { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = 'https://shows.acast.com/riktigt-bra-hr'
  const html = await fetch(url).then(res => res.text())
  const $ = cheerio.load(html)

  const episodes = []

  $('.EpisodeListItem__Container-sc-1g7x8ol-0').each((_, el) => {
    const title = $(el).find('h3').text().trim()
    const link = $(el).find('a').attr('href')
    const description = $(el).find('p').text().trim()
    const date = $(el).find('time').attr('datetime')

    if (title && link) {
      episodes.push({
        title,
        link: `https://shows.acast.com${link}`,
        description,
        date
      })
    }
  })

  res.status(200).json(episodes)
}
