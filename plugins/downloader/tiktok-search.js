export default {
  run: async (m, {
    text,
    conn,
    usedPrefix: _p,
    command
  }) => {
    if (!text) return m.reply('cari naon?')
    let stt = (await await axios.post(API('xzn', 'api/tiktok-search', {}, ''), {
      keywords: text,
      count: 30
    }, {
      headers: {
        Authorization: xznkey
      }
    })).data;
    let random = stt.getRandom();
    if (!random) return m.reply(stt.data);
    await conn.sendFile(m.chat, random.play, '', `${formatK(random.digg_count)} Likes, ${formatK(random.comment_count)} Comments. TikTok video from ${random.author.nickname} (@${random.author.unique_id}): "${random.title}". ${random.music_info.title}.`, m);
  },
  help: ['asupan'],
  command: ['asupan'],
  tags: ['downloader']
}
  function formatK(num) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num)
  }