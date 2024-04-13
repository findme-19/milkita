export default {
	help: ['randommeme', 'meme'],
	command: ['randommeme', 'meme'],
	tags: ['tools'],
	desc: `random meme`,
	disabled: false,
	run: async (m, {
		conn,
		text
	}) => {
		var c = await axios.get(API('xzn', 'api/randommeme', {}, 'apikey'))
		if (c.data.status) return m.reply(c.data)
		conn.sendFile(m.chat, c.data.media, "", c.data.caption, m)
	}
}